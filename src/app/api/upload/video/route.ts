import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'videos';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (video formats)
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only MP4, WebM, MOV, AVI allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 100MB for videos)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Max 100MB allowed.' },
        { status: 400 }
      );
    }

    // Convert to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Save to DB (using Image model for media storage)
    const video = await prisma.image.create({
      data: {
        filename: file.name,
        mimeType: file.type,
        data: base64,
        folder,
      },
    });

    // Return URL that points to our image API (works for video too)
    const url = `/api/images/${video.id}`;

    return NextResponse.json({
      success: true,
      data: {
        id: video.id,
        url,
        filename: video.filename,
      },
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}
