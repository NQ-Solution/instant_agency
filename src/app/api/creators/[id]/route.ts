import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sampleDataStore } from '@/lib/sampleData';

// GET single creator
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const creator = await prisma.creator.findUnique({ where: { id } });

    if (!creator) {
      return NextResponse.json(
        { success: false, error: 'Creator not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: creator });
  } catch (error) {
    console.error('Error fetching creator:', error);
    const { id } = await params;
    const creator = sampleDataStore.getCreatorById(id);
    if (creator) {
      return NextResponse.json({ success: true, data: creator, source: 'sample' });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch creator' },
      { status: 500 }
    );
  }
}

// PUT update creator
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const creator = await prisma.creator.update({
      where: { id },
      data: {
        name: data.name,
        platform: data.platform,
        category: data.category,
        image: data.image,
        followers: data.followers,
        views: data.views,
        featured: data.featured,
        order: data.order,
        active: data.active,
      },
    });

    return NextResponse.json({ success: true, data: creator });
  } catch (error) {
    console.error('Error updating creator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update creator' },
      { status: 500 }
    );
  }
}

// DELETE creator
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.creator.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Creator deleted' });
  } catch (error) {
    console.error('Error deleting creator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete creator' },
      { status: 500 }
    );
  }
}
