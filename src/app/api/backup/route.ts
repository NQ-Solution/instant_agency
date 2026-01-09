import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { gzipSync, gunzipSync } from 'zlib';

export const dynamic = 'force-dynamic';

const MAX_DB_BACKUPS = 3;

// 백업 데이터 생성 헬퍼 함수
async function createBackupData(includeImages: boolean) {
  const [
    models,
    creators,
    bookings,
    bookingSettings,
    pages,
    settings,
    inquiries,
    liveVideos,
    images,
  ] = await Promise.all([
    prisma.model.findMany(),
    prisma.creator.findMany(),
    prisma.booking.findMany(),
    prisma.bookingSettings.findMany(),
    prisma.page.findMany(),
    prisma.settings.findMany(),
    prisma.inquiry.findMany(),
    prisma.liveVideo.findMany(),
    includeImages ? prisma.image.findMany() : Promise.resolve([]),
  ]);

  return {
    version: '1.0',
    createdAt: new Date().toISOString(),
    data: {
      models,
      creators,
      bookings,
      bookingSettings,
      pages,
      settings,
      inquiries,
      liveVideos,
      ...(includeImages && { images }),
    },
  };
}

// 오래된 백업 삭제 (최대 3개 유지)
async function cleanupOldBackups() {
  const backups = await prisma.backup.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  if (backups.length > MAX_DB_BACKUPS) {
    const toDelete = backups.slice(MAX_DB_BACKUPS).map(b => b.id);
    await prisma.backup.deleteMany({
      where: { id: { in: toDelete } },
    });
    return toDelete.length;
  }
  return 0;
}

// GET: 데이터 백업 (JSON 내보내기 또는 DB 백업 목록)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const includeImages = searchParams.get('includeImages') === 'true';

    // DB 백업 목록 조회
    if (action === 'list') {
      const backups = await prisma.backup.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          size: true,
          compressedSize: true,
          includesImages: true,
          createdAt: true,
        },
      });
      return NextResponse.json({ success: true, data: backups });
    }

    // 특정 DB 백업 다운로드
    if (action === 'download') {
      const backupId = searchParams.get('id');
      if (!backupId) {
        return NextResponse.json(
          { success: false, error: 'Backup ID required' },
          { status: 400 }
        );
      }

      const backup = await prisma.backup.findUnique({
        where: { id: backupId },
      });

      if (!backup) {
        return NextResponse.json(
          { success: false, error: 'Backup not found' },
          { status: 404 }
        );
      }

      // 압축 해제
      const compressedBuffer = Buffer.from(backup.data, 'base64');
      const decompressed = gunzipSync(compressedBuffer);
      const backupData = JSON.parse(decompressed.toString('utf-8'));

      return NextResponse.json({ success: true, data: backupData });
    }

    // 기본: JSON 백업 생성 (다운로드용)
    const backupData = await createBackupData(includeImages);

    return NextResponse.json({
      success: true,
      data: backupData,
    });
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}

// POST: 데이터 복원 또는 DB에 압축 백업 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data, options, name, description, includeImages } = body;

    // DB에 압축 백업 저장
    if (action === 'saveToDb') {
      const backupData = await createBackupData(includeImages || false);
      const jsonString = JSON.stringify(backupData);
      const originalSize = Buffer.byteLength(jsonString, 'utf-8');

      // gzip 압축
      const compressed = gzipSync(Buffer.from(jsonString, 'utf-8'));
      const compressedBase64 = compressed.toString('base64');
      const compressedSize = compressed.length;

      // 백업 저장
      const backup = await prisma.backup.create({
        data: {
          name: name || `백업 ${new Date().toLocaleString('ko-KR')}`,
          description: description || null,
          data: compressedBase64,
          size: originalSize,
          compressedSize: compressedSize,
          includesImages: includeImages || false,
        },
      });

      // 오래된 백업 정리 (최대 3개 유지)
      const deletedCount = await cleanupOldBackups();

      return NextResponse.json({
        success: true,
        message: 'Backup saved to database',
        data: {
          id: backup.id,
          name: backup.name,
          size: originalSize,
          compressedSize: compressedSize,
          compressionRatio: ((1 - compressedSize / originalSize) * 100).toFixed(1) + '%',
          deletedOldBackups: deletedCount,
        },
      });
    }

    // 데이터 복원 (JSON 파일 또는 DB 백업에서)
    if (!data || !data.version) {
      return NextResponse.json(
        { success: false, error: 'Invalid backup file format' },
        { status: 400 }
      );
    }

    const { clearExisting = false } = options || {};
    const results: Record<string, { imported: number; errors: number }> = {};

    // 기존 데이터 삭제 (옵션에 따라)
    if (clearExisting) {
      await Promise.all([
        prisma.model.deleteMany(),
        prisma.creator.deleteMany(),
        prisma.booking.deleteMany(),
        prisma.bookingSettings.deleteMany(),
        prisma.page.deleteMany(),
        prisma.settings.deleteMany(),
        prisma.inquiry.deleteMany(),
        prisma.liveVideo.deleteMany(),
        prisma.image.deleteMany(),
      ]);
    }

    // Models 복원
    if (data.data.models?.length > 0) {
      results.models = { imported: 0, errors: 0 };
      for (const model of data.data.models) {
        try {
          await prisma.model.upsert({
            where: { id: model.id },
            update: {
              name: model.name,
              nameKr: model.nameKr,
              slug: model.slug,
              category: model.category,
              featured: model.featured,
              profileImage: model.profileImage,
              galleryImages: model.galleryImages,
              stats: model.stats,
              location: model.location,
              bio: model.bio,
              experience: model.experience,
              social: model.social,
              active: model.active,
              order: model.order,
            },
            create: model,
          });
          results.models.imported++;
        } catch (e) {
          console.error('Model import error:', e);
          results.models.errors++;
        }
      }
    }

    // Creators 복원
    if (data.data.creators?.length > 0) {
      results.creators = { imported: 0, errors: 0 };
      for (const creator of data.data.creators) {
        try {
          await prisma.creator.upsert({
            where: { id: creator.id },
            update: {
              name: creator.name,
              platform: creator.platform,
              category: creator.category,
              image: creator.image,
              followers: creator.followers,
              views: creator.views,
              featured: creator.featured,
              order: creator.order,
              active: creator.active,
            },
            create: creator,
          });
          results.creators.imported++;
        } catch (e) {
          console.error('Creator import error:', e);
          results.creators.errors++;
        }
      }
    }

    // Bookings 복원
    if (data.data.bookings?.length > 0) {
      results.bookings = { imported: 0, errors: 0 };
      for (const booking of data.data.bookings) {
        try {
          await prisma.booking.upsert({
            where: { id: booking.id },
            update: {
              date: new Date(booking.date),
              time: booking.time,
              endTime: booking.endTime,
              service: booking.service,
              customer: booking.customer,
              status: booking.status,
              notes: booking.notes,
            },
            create: {
              ...booking,
              date: new Date(booking.date),
            },
          });
          results.bookings.imported++;
        } catch (e) {
          console.error('Booking import error:', e);
          results.bookings.errors++;
        }
      }
    }

    // BookingSettings 복원
    if (data.data.bookingSettings?.length > 0) {
      results.bookingSettings = { imported: 0, errors: 0 };
      for (const setting of data.data.bookingSettings) {
        try {
          await prisma.bookingSettings.upsert({
            where: { id: setting.id },
            update: {
              availableTimes: setting.availableTimes,
              blockedDates: setting.blockedDates,
              blockedWeekdays: setting.blockedWeekdays,
              minAdvanceHours: setting.minAdvanceHours,
              maxAdvanceDays: setting.maxAdvanceDays,
              slotDuration: setting.slotDuration,
            },
            create: setting,
          });
          results.bookingSettings.imported++;
        } catch (e) {
          console.error('BookingSettings import error:', e);
          results.bookingSettings.errors++;
        }
      }
    }

    // Pages 복원
    if (data.data.pages?.length > 0) {
      results.pages = { imported: 0, errors: 0 };
      for (const page of data.data.pages) {
        try {
          await prisma.page.upsert({
            where: { pageId: page.pageId },
            update: {
              sections: page.sections,
            },
            create: page,
          });
          results.pages.imported++;
        } catch (e) {
          console.error('Page import error:', e);
          results.pages.errors++;
        }
      }
    }

    // Settings 복원
    if (data.data.settings?.length > 0) {
      results.settings = { imported: 0, errors: 0 };
      for (const setting of data.data.settings) {
        try {
          await prisma.settings.upsert({
            where: { id: setting.id },
            update: {
              site: setting.site,
              contact: setting.contact,
              business: setting.business,
              pageVisibility: setting.pageVisibility,
              offices: setting.offices,
              social: setting.social,
              partners: setting.partners,
            },
            create: setting,
          });
          results.settings.imported++;
        } catch (e) {
          console.error('Settings import error:', e);
          results.settings.errors++;
        }
      }
    }

    // Inquiries 복원
    if (data.data.inquiries?.length > 0) {
      results.inquiries = { imported: 0, errors: 0 };
      for (const inquiry of data.data.inquiries) {
        try {
          await prisma.inquiry.upsert({
            where: { id: inquiry.id },
            update: {
              name: inquiry.name,
              email: inquiry.email,
              phone: inquiry.phone,
              company: inquiry.company,
              subject: inquiry.subject,
              message: inquiry.message,
              status: inquiry.status,
            },
            create: inquiry,
          });
          results.inquiries.imported++;
        } catch (e) {
          console.error('Inquiry import error:', e);
          results.inquiries.errors++;
        }
      }
    }

    // LiveVideos 복원
    if (data.data.liveVideos?.length > 0) {
      results.liveVideos = { imported: 0, errors: 0 };
      for (const video of data.data.liveVideos) {
        try {
          await prisma.liveVideo.upsert({
            where: { id: video.id },
            update: {
              tag: video.tag,
              title: video.title,
              creator: video.creator,
              videoUrl: video.videoUrl,
              label: video.label,
              infoTitle: video.infoTitle,
              desc: video.desc,
              stats: video.stats,
              order: video.order,
              active: video.active,
            },
            create: video,
          });
          results.liveVideos.imported++;
        } catch (e) {
          console.error('LiveVideo import error:', e);
          results.liveVideos.errors++;
        }
      }
    }

    // Images 복원 (선택적)
    if (data.data.images?.length > 0) {
      results.images = { imported: 0, errors: 0 };
      for (const image of data.data.images) {
        try {
          await prisma.image.upsert({
            where: { id: image.id },
            update: {
              filename: image.filename,
              mimeType: image.mimeType,
              data: image.data,
              folder: image.folder,
            },
            create: image,
          });
          results.images.imported++;
        } catch (e) {
          console.error('Image import error:', e);
          results.images.errors++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Backup restored successfully',
      results,
    });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}

// DELETE: DB 백업 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const backupId = searchParams.get('id');

    if (!backupId) {
      return NextResponse.json(
        { success: false, error: 'Backup ID required' },
        { status: 400 }
      );
    }

    await prisma.backup.delete({
      where: { id: backupId },
    });

    return NextResponse.json({
      success: true,
      message: 'Backup deleted successfully',
    });
  } catch (error) {
    console.error('Delete backup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete backup' },
      { status: 500 }
    );
  }
}
