import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { models } = data;

    if (!models || !Array.isArray(models)) {
      return NextResponse.json(
        { success: false, error: 'Invalid models data' },
        { status: 400 }
      );
    }

    // Update all models' order in a transaction
    await prisma.$transaction(
      models.map((model: { id: string; order: number }) =>
        prisma.model.update({
          where: { id: model.id },
          data: { order: model.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder models' },
      { status: 500 }
    );
  }
}
