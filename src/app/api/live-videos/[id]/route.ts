import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sampleDataStore } from '@/lib/sampleData';

// GET single live video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const video = await prisma.liveVideo.findUnique({ where: { id } });

    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Live video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    console.error('Error fetching live video:', error);
    const { id } = await params;
    const video = sampleDataStore.getLiveVideoById(id);
    if (video) {
      return NextResponse.json({ success: true, data: video, source: 'sample' });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live video' },
      { status: 500 }
    );
  }
}

// PUT update live video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const video = await prisma.liveVideo.update({
      where: { id },
      data: {
        tag: data.tag,
        title: data.title,
        creator: data.creator,
        videoUrl: data.videoUrl,
        label: data.label,
        infoTitle: data.infoTitle,
        desc: data.desc,
        stats: data.stats,
        order: data.order,
        active: data.active,
      },
    });

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    console.error('Error updating live video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update live video' },
      { status: 500 }
    );
  }
}

// DELETE live video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.liveVideo.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Live video deleted' });
  } catch (error) {
    console.error('Error deleting live video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete live video' },
      { status: 500 }
    );
  }
}
