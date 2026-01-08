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

    // Build update object with only provided fields (partial update support)
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.nameKr !== undefined) updateData.nameKr = data.nameKr;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage;
    if (data.galleryImages !== undefined) updateData.galleryImages = data.galleryImages;
    if (data.stats !== undefined) updateData.stats = data.stats;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.experience !== undefined) updateData.experience = data.experience;
    if (data.social !== undefined) updateData.social = data.social;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.order !== undefined) updateData.order = data.order;

    const model = await prisma.model.update({
      where: { id },
      data: updateData,
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
