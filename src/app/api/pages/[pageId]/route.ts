import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sampleDataStore } from '@/lib/sampleData';

// GET page content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;

    const page = await prisma.page.findUnique({ where: { pageId } });

    // If page doesn't exist, return default structure
    if (!page) {
      return NextResponse.json(
        { success: true, data: { pageId, sections: [] } },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    return NextResponse.json(
      { success: true, data: page },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Error fetching page:', error);
    const { pageId } = await params;
    const page = sampleDataStore.getPage(pageId) || { pageId, sections: [] };
    return NextResponse.json(
      { success: true, data: page, source: 'sample' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}

// PUT update page content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const data = await request.json();

    const page = await prisma.page.upsert({
      where: { pageId },
      update: { sections: data.sections },
      create: { pageId, sections: data.sections ?? [] },
    });

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update page' },
      { status: 500 }
    );
  }
}
