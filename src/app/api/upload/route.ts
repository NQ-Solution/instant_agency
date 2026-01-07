import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

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

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Max 10MB allowed.' },
        { status: 400 }
      );
    }

    // Use Cloudinary if configured
    if (isCloudinaryConfigured()) {
      const { v2: cloudinary } = await import('cloudinary');

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: `instant-agency/${folder}`,
        resource_type: 'auto',
      });

      return NextResponse.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        },
      });
    }

    // Local storage fallback
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${randomStr}.${ext}`;

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Write file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return public URL
    const url = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url,
        publicId: `${folder}/${filename}`,
        filename,
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// DELETE image
export async function DELETE(request: NextRequest) {
  try {
    const { publicId, url } = await request.json();

    // If Cloudinary configured and publicId looks like a Cloudinary ID
    if (isCloudinaryConfigured() && publicId && publicId.includes('/') && !publicId.startsWith('uploads/')) {
      const { v2: cloudinary } = await import('cloudinary');

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      await cloudinary.uploader.destroy(publicId);
      return NextResponse.json({ success: true, message: 'Image deleted from Cloudinary' });
    }

    // Local file deletion
    if (url && url.startsWith('/uploads/')) {
      const filepath = path.join(process.cwd(), 'public', url);
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
      return NextResponse.json({ success: true, message: 'Image deleted from local storage' });
    }

    return NextResponse.json({ success: true, message: 'No action taken' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
