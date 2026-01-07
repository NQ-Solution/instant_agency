import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sampleDataStore } from '@/lib/sampleData';

// GET all live videos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeParam = searchParams.get('active');

    const where = activeParam === 'all' ? {} : { active: true };

    const videos = await prisma.liveVideo.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error('Error fetching live videos:', error);
    const videos = sampleDataStore.getLiveVideos();
    return NextResponse.json({ success: true, data: videos, source: 'sample' });
  }
}

// POST create new live video
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const video = await prisma.liveVideo.create({
      data: {
        tag: data.tag,
        title: data.title,
        creator: data.creator,
        videoUrl: data.videoUrl,
        label: data.label,
        infoTitle: data.infoTitle,
        desc: data.desc,
        stats: data.stats ?? { views: '0', conversion: '0%' },
        order: data.order ?? 0,
        active: data.active ?? true,
      },
    });

    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error) {
    console.error('Error creating live video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create live video' },
      { status: 500 }
    );
  }
}
