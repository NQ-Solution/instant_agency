import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

const defaultSettings = {
  availableTimes: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  blockedDates: [],
  blockedWeekdays: [],
  minAdvanceHours: 24,
  maxAdvanceDays: 60,
  slotDuration: 60,
};

// GET booking settings
export async function GET() {
  try {
    let settings = await prisma.bookingSettings.findFirst();

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({ success: true, data: defaultSettings });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching booking settings:', error);
    return NextResponse.json({ success: true, data: defaultSettings });
  }
}

// PUT update booking settings
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Find existing settings or create new one
    let settings = await prisma.bookingSettings.findFirst();

    if (settings) {
      settings = await prisma.bookingSettings.update({
        where: { id: settings.id },
        data: {
          availableTimes: data.availableTimes ?? defaultSettings.availableTimes,
          blockedDates: data.blockedDates ?? defaultSettings.blockedDates,
          blockedWeekdays: data.blockedWeekdays ?? defaultSettings.blockedWeekdays,
          minAdvanceHours: data.minAdvanceHours ?? defaultSettings.minAdvanceHours,
          maxAdvanceDays: data.maxAdvanceDays ?? defaultSettings.maxAdvanceDays,
          slotDuration: data.slotDuration ?? defaultSettings.slotDuration,
        },
      });
    } else {
      settings = await prisma.bookingSettings.create({
        data: {
          availableTimes: data.availableTimes ?? defaultSettings.availableTimes,
          blockedDates: data.blockedDates ?? defaultSettings.blockedDates,
          blockedWeekdays: data.blockedWeekdays ?? defaultSettings.blockedWeekdays,
          minAdvanceHours: data.minAdvanceHours ?? defaultSettings.minAdvanceHours,
          maxAdvanceDays: data.maxAdvanceDays ?? defaultSettings.maxAdvanceDays,
          slotDuration: data.slotDuration ?? defaultSettings.slotDuration,
        },
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating booking settings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Failed to update booking settings', details: errorMessage },
      { status: 500 }
    );
  }
}
