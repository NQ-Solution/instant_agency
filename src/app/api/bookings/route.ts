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

    // Helper function to get KST date range in UTC
    const getKSTDateRange = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      // KST 00:00 = UTC previous day 15:00, KST 23:59:59 = UTC 14:59:59
      const startOfDay = new Date(Date.UTC(year, month - 1, day, -9, 0, 0));
      const endOfDay = new Date(Date.UTC(year, month - 1, day, 14, 59, 59, 999));
      return { startOfDay, endOfDay };
    };

    // If checking availability, no auth required
    if (checkAvailability && date) {
      const { startOfDay, endOfDay } = getKSTDateRange(date);

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
      const { startOfDay, endOfDay } = getKSTDateRange(date);
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

    // Parse date string (YYYY-MM-DD) and create KST date
    // KST is UTC+9, so we use UTC and add 9 hours offset consideration
    const [year, month, day] = data.date.split('-').map(Number);
    // Store as UTC but representing KST noon (12:00 KST = 03:00 UTC)
    const bookingDate = new Date(Date.UTC(year, month - 1, day, 3, 0, 0));

    // Check for conflicts - use the same UTC-based range
    const startOfDay = new Date(Date.UTC(year, month - 1, day, -9, 0, 0)); // KST 00:00
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 14, 59, 59, 999)); // KST 23:59:59

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
        kakaoId: data.kakaoId,
        isUniversityStudent: data.isUniversityStudent,
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
