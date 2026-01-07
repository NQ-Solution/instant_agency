import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sampleDataStore } from '@/lib/sampleData';

// GET all creators
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');

    const where: {
      featured?: boolean;
      active?: boolean;
    } = {};

    if (featured === 'true') {
      where.featured = true;
    }
    if (active !== 'false') {
      where.active = true;
    }

    const creators = await prisma.creator.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: creators });
  } catch (error) {
    console.error('Error fetching creators:', error);
    const creators = sampleDataStore.getCreators();
    return NextResponse.json({ success: true, data: creators, source: 'sample' });
  }
}

// POST create new creator
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const creator = await prisma.creator.create({
      data: {
        name: data.name,
        platform: data.platform,
        category: data.category,
        image: data.image,
        followers: data.followers,
        views: data.views,
        featured: data.featured ?? false,
        order: data.order ?? 0,
        active: data.active ?? true,
      },
    });

    return NextResponse.json({ success: true, data: creator }, { status: 201 });
  } catch (error) {
    console.error('Error creating creator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create creator' },
      { status: 500 }
    );
  }
}
