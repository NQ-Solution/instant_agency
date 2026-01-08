import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sampleDataStore } from '@/lib/sampleData';

// GET settings
export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Return default settings if none exist
      const defaultSettings = sampleDataStore.getSettings();
      return NextResponse.json({ success: true, data: defaultSettings });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    const settings = sampleDataStore.getSettings();
    return NextResponse.json({ success: true, data: settings, source: 'sample' });
  }
}

// PUT update settings
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Find existing settings or create new one
    let settings = await prisma.settings.findFirst();

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          site: data.site,
          contact: data.contact,
          business: data.business,
          offices: data.offices,
          social: data.social,
          partners: data.partners,
        },
      });
    } else {
      settings = await prisma.settings.create({
        data: {
          site: data.site ?? {},
          contact: data.contact ?? {},
          business: data.business ?? {},
          offices: data.offices ?? [],
          social: data.social ?? {},
          partners: data.partners ?? [],
        },
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
