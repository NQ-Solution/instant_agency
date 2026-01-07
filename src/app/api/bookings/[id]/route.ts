import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sampleDataStore } from '@/lib/sampleData';

// GET single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    const { id } = await params;
    const booking = sampleDataStore.getBookingById(id);
    if (booking) {
      return NextResponse.json({ success: true, data: booking, source: 'sample' });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PUT update booking status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        time: data.time,
        endTime: data.endTime,
        service: data.service,
        customer: data.customer,
        status: data.status,
        notes: data.notes,
      },
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.booking.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
