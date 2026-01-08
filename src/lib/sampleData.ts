// Fallback data store when database is unavailable

import type { Model, Creator, Booking, Settings, LiveVideo, Inquiry } from '@/types';

// Empty arrays - all data should come from database
const sampleModels: Model[] = [];
const sampleCreators: Creator[] = [];
const sampleBookings: Booking[] = [];
const sampleLiveVideos: LiveVideo[] = [];
const sampleInquiries: Inquiry[] = [];

// Default Settings
const sampleSettings: Settings = {
  id: 'default-settings',
  site: {
    name: 'Instant Agency',
    tagline: '',
  },
  contact: {
    email: '',
    phone: '',
    businessHours: '',
  },
  business: {
    businessNumber: '',
    businessName: '',
    representative: '',
    businessAddress: '',
    ecommerceNumber: '',
    hostingProvider: '',
  },
  offices: [],
  social: {},
  partners: [],
};

// Empty pages
const samplePages: Record<string, unknown> = {};

// In-memory data store
class SampleDataStore {
  private models: Model[] = [...sampleModels];
  private creators: Creator[] = [...sampleCreators];
  private bookings: Booking[] = [...sampleBookings];
  private settings: Settings = { ...sampleSettings };
  private pages: Record<string, unknown> = { ...samplePages };
  private liveVideos: LiveVideo[] = [...sampleLiveVideos];
  private inquiries: Inquiry[] = [...sampleInquiries];
  private nextId = 100;

  private generateId(): string {
    return String(this.nextId++);
  }

  // Models CRUD
  getModels(filters?: { category?: string; featured?: boolean; active?: boolean }): Model[] {
    let result = [...this.models];
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        result = result.filter(m => m.category === filters.category);
      }
      if (filters.featured !== undefined) {
        result = result.filter(m => m.featured === filters.featured);
      }
      if (filters.active !== false) {
        result = result.filter(m => m.active);
      }
    }
    return result.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getModelById(id: string): Model | undefined {
    return this.models.find(m => m.id === id || m.slug === id);
  }

  createModel(data: Partial<Model>): Model {
    const newModel: Model = {
      ...data,
      id: this.generateId(),
      slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || '',
      active: data.active ?? true,
      order: this.models.length + 1,
    } as Model;
    this.models.push(newModel);
    return newModel;
  }

  updateModel(id: string, data: Partial<Model>): Model | null {
    const index = this.models.findIndex(m => m.id === id);
    if (index === -1) return null;
    this.models[index] = { ...this.models[index], ...data };
    return this.models[index];
  }

  deleteModel(id: string): boolean {
    const index = this.models.findIndex(m => m.id === id);
    if (index === -1) return false;
    this.models.splice(index, 1);
    return true;
  }

  // Creators CRUD
  getCreators(filters?: { featured?: boolean; active?: boolean }): Creator[] {
    let result = [...this.creators];
    if (filters) {
      if (filters.featured !== undefined) {
        result = result.filter(c => c.featured === filters.featured);
      }
    }
    return result.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getCreatorById(id: string): Creator | undefined {
    return this.creators.find(c => c.id === id);
  }

  createCreator(data: Partial<Creator>): Creator {
    const newCreator: Creator = {
      ...data,
      id: this.generateId(),
      order: this.creators.length + 1,
    } as Creator;
    this.creators.push(newCreator);
    return newCreator;
  }

  updateCreator(id: string, data: Partial<Creator>): Creator | null {
    const index = this.creators.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.creators[index] = { ...this.creators[index], ...data };
    return this.creators[index];
  }

  deleteCreator(id: string): boolean {
    const index = this.creators.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.creators.splice(index, 1);
    return true;
  }

  // Bookings CRUD
  getBookings(filters?: { date?: Date; status?: string }): Booking[] {
    let result = [...this.bookings];
    if (filters) {
      if (filters.date) {
        const dateStr = filters.date.toISOString().split('T')[0];
        result = result.filter(b => {
          const bookingDate = new Date(b.date).toISOString().split('T')[0];
          return bookingDate === dateStr;
        });
      }
      if (filters.status) {
        result = result.filter(b => b.status === filters.status);
      }
    }
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  createBooking(data: Partial<Booking>): Booking {
    const newBooking: Booking = {
      ...data,
      id: this.generateId(),
      status: data.status || 'pending',
    } as Booking;
    this.bookings.push(newBooking);
    return newBooking;
  }

  updateBooking(id: string, data: Partial<Booking>): Booking | null {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.bookings[index] = { ...this.bookings[index], ...data };
    return this.bookings[index];
  }

  deleteBooking(id: string): boolean {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.bookings.splice(index, 1);
    return true;
  }

  // Settings
  getSettings(): Settings {
    return { ...this.settings };
  }

  updateSettings(data: Partial<Settings>): Settings {
    this.settings = { ...this.settings, ...data };
    return this.settings;
  }

  // Pages
  getPage(pageId: string): unknown {
    return this.pages[pageId] || null;
  }

  updatePage(pageId: string, data: unknown): unknown {
    this.pages[pageId] = data;
    return this.pages[pageId];
  }

  // Live Videos CRUD
  getLiveVideos(filters?: { active?: boolean }): LiveVideo[] {
    let result = [...this.liveVideos];
    if (filters?.active !== false) {
      result = result.filter(v => v.active);
    }
    return result.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getLiveVideoById(id: string): LiveVideo | undefined {
    return this.liveVideos.find(v => v.id === id);
  }

  createLiveVideo(data: Partial<LiveVideo>): LiveVideo {
    const newVideo: LiveVideo = {
      ...data,
      id: this.generateId(),
      order: this.liveVideos.length + 1,
      active: data.active ?? true,
    } as LiveVideo;
    this.liveVideos.push(newVideo);
    return newVideo;
  }

  updateLiveVideo(id: string, data: Partial<LiveVideo>): LiveVideo | null {
    const index = this.liveVideos.findIndex(v => v.id === id);
    if (index === -1) return null;
    this.liveVideos[index] = { ...this.liveVideos[index], ...data };
    return this.liveVideos[index];
  }

  deleteLiveVideo(id: string): boolean {
    const index = this.liveVideos.findIndex(v => v.id === id);
    if (index === -1) return false;
    this.liveVideos.splice(index, 1);
    return true;
  }

  // Inquiries CRUD
  getInquiries(filters?: { status?: string }): Inquiry[] {
    let result = [...this.inquiries];
    if (filters?.status) {
      result = result.filter(i => i.status === filters.status);
    }
    return result.sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  getInquiryById(id: string): Inquiry | undefined {
    return this.inquiries.find(i => i.id === id);
  }

  createInquiry(data: Partial<Inquiry>): Inquiry {
    const newInquiry: Inquiry = {
      ...data,
      id: this.generateId(),
      status: data.status || 'pending',
      createdAt: new Date(),
    } as Inquiry;
    this.inquiries.push(newInquiry);
    return newInquiry;
  }

  updateInquiry(id: string, data: Partial<Inquiry>): Inquiry | null {
    const index = this.inquiries.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.inquiries[index] = { ...this.inquiries[index], ...data };
    return this.inquiries[index];
  }

  deleteInquiry(id: string): boolean {
    const index = this.inquiries.findIndex(i => i.id === id);
    if (index === -1) return false;
    this.inquiries.splice(index, 1);
    return true;
  }
}

export const sampleDataStore = new SampleDataStore();

export function shouldUseSampleData(): boolean {
  return false;
}
