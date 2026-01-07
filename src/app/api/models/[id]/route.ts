import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sampleDataStore } from '@/lib/sampleData';

// GET single model
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let model = await prisma.model.findUnique({ where: { id } });
    if (!model) {
      model = await prisma.model.findUnique({ where: { slug: id } });
    }

    if (!model) {
      return NextResponse.json(
        { success: false, error: 'Model not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: model });
  } catch (error) {
    console.error('Error fetching model:', error);
    const { id } = await params;
    const model = sampleDataStore.getModelById(id);
    if (model) {
      return NextResponse.json({ success: true, data: model, source: 'sample' });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch model' },
      { status: 500 }
    );
  }
}

// PUT update model
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const model = await prisma.model.update({
      where: { id },
      data: {
        name: data.name,
        nameKr: data.nameKr,
        slug: data.slug,
        category: data.category,
        featured: data.featured,
        profileImage: data.profileImage,
        galleryImages: data.galleryImages,
        stats: data.stats,
        location: data.location,
        bio: data.bio,
        experience: data.experience,
        social: data.social,
        active: data.active,
        order: data.order,
      },
    });

    return NextResponse.json({ success: true, data: model });
  } catch (error) {
    console.error('Error updating model:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update model' },
      { status: 500 }
    );
  }
}

// DELETE model
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.model.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Model deleted' });
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete model' },
      { status: 500 }
    );
  }
}
