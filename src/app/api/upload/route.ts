import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, WEBP allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB for DB storage)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Max 5MB allowed.' },
        { status: 400 }
      );
    }

    // Convert to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Save to DB
    const image = await prisma.image.create({
      data: {
        filename: file.name,
        mimeType: file.type,
        data: base64,
        folder,
      },
    });

    // Return URL that points to our image API
    const url = `/api/images/${image.id}`;

    return NextResponse.json({
      success: true,
      data: {
        id: image.id,
        url,
        filename: image.filename,
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to upload file: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// DELETE image
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID required' },
        { status: 400 }
      );
    }

    await prisma.image.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
