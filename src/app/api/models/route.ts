import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sampleDataStore } from '@/lib/sampleData';

// GET all models
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');

    // Build query
    const where: {
      category?: string;
      featured?: boolean;
      active?: boolean;
    } = {};

    if (category && category !== 'all') {
      where.category = category;
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (active !== 'false') {
      where.active = true;
    }

    const models = await prisma.model.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: models });
  } catch (error) {
    console.error('Error fetching models:', error);
    // Fallback to sample data on error
    const models = sampleDataStore.getModels();
    return NextResponse.json({ success: true, data: models, source: 'sample' });
  }
}

// POST create new model
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const model = await prisma.model.create({
      data: {
        name: data.name,
        nameKr: data.nameKr,
        slug: data.slug,
        category: data.category,
        featured: data.featured ?? false,
        profileImage: data.profileImage,
        galleryImages: data.galleryImages ?? [],
        stats: data.stats ?? {},
        location: data.location ?? 'Seoul',
        bio: data.bio,
        experience: data.experience ?? [],
        social: data.social ?? {},
        active: data.active ?? true,
        order: data.order ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: model }, { status: 201 });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create model' },
      { status: 500 }
    );
  }
}
