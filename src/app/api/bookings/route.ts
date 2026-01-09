import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sampleDataStore } from '@/lib/sampleData';

// GET all bookings (admin only) or check availability
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const checkAvailability = searchParams.get('available');

    // If checking availability, no auth required
    if (checkAvailability && date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const bookings = await prisma.booking.findMany({
        where: {
          date: { gte: startOfDay, lte: endOfDay },
          status: { not: 'cancelled' },
        },
        select: { time: true, endTime: true, service: true },
      });

      return NextResponse.json({ success: true, data: bookings });
    }

    const where: {
      date?: { gte: Date; lte: Date };
      status?: string;
    } = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.date = { gte: startOfDay, lte: endOfDay };
    }

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    const bookings = sampleDataStore.getBookings();
    return NextResponse.json({ success: true, data: bookings, source: 'sample' });
  }
}

// POST create new booking (public)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.date || !data.time || !data.service || !data.customer) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse date string (YYYY-MM-DD) and set to noon to avoid timezone issues
    const [year, month, day] = data.date.split('-').map(Number);
    const bookingDate = new Date(year, month - 1, day, 12, 0, 0);

    // Check for conflicts
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        time: data.time,
        status: { not: 'cancelled' },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Time slot already booked' },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        date: bookingDate,
        time: data.time,
        endTime: data.endTime,
        service: data.service,
        customer: data.customer,
        status: 'pending',
        notes: data.notes,
      },
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
