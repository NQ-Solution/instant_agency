// In-memory sample data store for development without MongoDB

import type { Model, Creator, Booking, Settings, LiveVideo } from '@/types';

// Sample Models
const sampleModels: Model[] = [
  {
    id: '1',
    name: 'Soo-Jin Park',
    nameKr: '박수진',
    slug: 'soo-jin-park',
    category: 'women',
    featured: true,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    ],
    stats: { height: '175cm', bust: '82cm', waist: '60cm', hips: '88cm', shoes: '250mm', eyes: 'Brown', hair: 'Black' },
    location: 'Seoul',
    bio: '서울 기반 패션 모델. 다양한 하이엔드 브랜드와 협업 경험.',
    experience: [
      { brand: 'Vogue Korea', year: '2023' },
      { brand: 'Dior', year: '2022' },
    ],
    social: { instagram: '@soojin_model' },
    active: true,
    order: 1,
  },
  {
    id: '2',
    name: 'Min-Jun Kim',
    nameKr: '김민준',
    slug: 'min-jun-kim',
    category: 'men',
    featured: true,
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
    ],
    stats: { height: '185cm', bust: '98cm', waist: '78cm', hips: '95cm', shoes: '275mm', eyes: 'Brown', hair: 'Black' },
    location: 'Seoul',
    bio: '남성 패션 모델. GQ, Esquire 등 다수 매거진 화보 촬영.',
    experience: [
      { brand: 'GQ Korea', year: '2023' },
      { brand: 'Samsung', year: '2023' },
    ],
    social: { instagram: '@minjun_model' },
    active: true,
    order: 2,
  },
  {
    id: '3',
    name: 'Yuna Lee',
    nameKr: '이유나',
    slug: 'yuna-lee',
    category: 'women',
    featured: true,
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
    ],
    stats: { height: '172cm', bust: '80cm', waist: '58cm', hips: '86cm', shoes: '240mm', eyes: 'Brown', hair: 'Brown' },
    location: 'Seoul',
    bio: '뷰티 & 패션 모델. 다수의 화장품 브랜드 광고 모델.',
    experience: [
      { brand: 'Amore Pacific', year: '2023' },
      { brand: 'Gentle Monster', year: '2022' },
    ],
    social: { instagram: '@yuna_model' },
    active: true,
    order: 3,
  },
  {
    id: '4',
    name: 'Ji-Hoon Choi',
    nameKr: '최지훈',
    slug: 'ji-hoon-choi',
    category: 'men',
    featured: false,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    stats: { height: '182cm', bust: '95cm', waist: '76cm', hips: '92cm', shoes: '270mm', eyes: 'Brown', hair: 'Black' },
    location: 'Seoul',
    bio: '커머셜 모델. TV 광고 및 브랜드 캠페인 다수 참여.',
    experience: [
      { brand: 'Hyundai', year: '2023' },
    ],
    social: { instagram: '@jihoon_model' },
    active: true,
    order: 4,
  },
  {
    id: '5',
    name: 'Ha-Eun Jung',
    nameKr: '정하은',
    slug: 'ha-eun-jung',
    category: 'new',
    featured: false,
    profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
    ],
    stats: { height: '170cm', bust: '78cm', waist: '56cm', hips: '84cm', shoes: '235mm', eyes: 'Brown', hair: 'Black' },
    location: 'Seoul',
    bio: '신인 모델. 활발한 활동 시작.',
    experience: [],
    social: { instagram: '@haeun_new' },
    active: true,
    order: 5,
  },
  {
    id: '6',
    name: 'Seung-Hyun Kang',
    nameKr: '강승현',
    slug: 'seung-hyun-kang',
    category: 'new',
    featured: false,
    profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800',
    ],
    stats: { height: '183cm', bust: '96cm', waist: '77cm', hips: '93cm', shoes: '275mm', eyes: 'Brown', hair: 'Brown' },
    location: 'Seoul',
    bio: '신인 남성 모델. 패션위크 런웨이 데뷔 준비 중.',
    experience: [],
    social: { instagram: '@seunghyun_new' },
    active: true,
    order: 6,
  },
];

// Sample Creators
const sampleCreators: Creator[] = [
  { id: '1', name: 'Yuna Kim', platform: 'TikTok', category: 'Fashion', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', followers: '1.2M', views: '50M', featured: true, active: true, order: 1 },
  { id: '2', name: 'Soo Min', platform: 'Instagram', category: 'Beauty', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', followers: '850K', views: '35M', featured: true, active: true, order: 2 },
  { id: '3', name: 'Jin Park', platform: 'TikTok', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', followers: '2.1M', views: '80M', featured: false, active: true, order: 3 },
  { id: '4', name: 'Hana Lee', platform: 'Instagram', category: 'Food', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400', followers: '600K', views: '25M', featured: false, active: true, order: 4 },
  { id: '5', name: 'Chris Jung', platform: 'TikTok', category: 'Tech', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', followers: '1.5M', views: '60M', featured: false, active: true, order: 5 },
  { id: '6', name: 'Mia Choi', platform: 'Instagram', category: 'Fashion', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', followers: '920K', views: '40M', featured: false, active: true, order: 6 },
];

// Sample Bookings
const today = new Date();
const sampleBookings: Booking[] = [
  {
    id: '1',
    date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
    time: '10:00',
    endTime: '11:00',
    service: 'Studio Consultation',
    customer: { name: 'Kim Studio', email: 'kim@studio.com', phone: '010-1234-5678' },
    status: 'confirmed',
    notes: '스튜디오 촬영 상담',
  },
  {
    id: '2',
    date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
    time: '14:00',
    endTime: '15:00',
    service: 'Model Casting',
    customer: { name: 'Fashion Brand', email: 'contact@fashionbrand.com', phone: '010-2345-6789' },
    status: 'pending',
    notes: '신제품 런칭용 모델 캐스팅 미팅',
  },
  {
    id: '3',
    date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
    time: '11:00',
    endTime: '12:00',
    service: 'Live Commerce Planning',
    customer: { name: 'Beauty Co.', email: 'hello@beautyco.com', phone: '010-3456-7890' },
    status: 'pending',
    notes: '라이브 커머스 기획 미팅',
  },
  {
    id: '4',
    date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    time: '09:00',
    endTime: '10:00',
    service: 'General Meeting',
    customer: { name: 'Magazine X', email: 'editor@magazinex.com', phone: '010-4567-8901' },
    status: 'confirmed',
    notes: '협업 논의',
  },
  {
    id: '5',
    date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
    time: '14:00',
    endTime: '15:00',
    service: 'Model Casting',
    customer: { name: 'Ad Agency', email: 'casting@adagency.com', phone: '010-5678-9012' },
    status: 'pending',
    notes: '광고 촬영 모델 캐스팅',
  },
  {
    id: '6',
    date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
    time: '10:00',
    endTime: '11:00',
    service: 'Studio Consultation',
    customer: { name: 'Photo Studio', email: 'hello@photostudio.com', phone: '010-6789-0123' },
    status: 'confirmed',
    notes: '스튜디오 대여 문의',
  },
];

// Sample Settings
const sampleSettings: Settings = {
  id: 'default-settings',
  site: {
    name: 'Instant Agency',
    tagline: 'Creative Studio & Model Agency',
  },
  contact: {
    email: 'contact@instant-agency.com',
    phone: '+82 2 1234 5678',
    businessHours: 'Mon - Fri, 10:00 - 19:00',
  },
  offices: [
    { city: 'Seoul', address: '강남구 테헤란로 123, 크리에이티브 빌딩 5층' },
    { city: 'Paris', address: '12 Rue de la Mode, Le Marais, 75003' },
    { city: 'New York', address: '456 Fashion Avenue, SoHo, NY 10012' },
  ],
  social: {
    instagram: 'https://instagram.com/instant_agency',
    linkedin: 'https://linkedin.com/company/instant-agency',
  },
  partners: [
    'Vogue', 'Elle', 'Dior', 'Chanel', 'Gucci',
    'Louis Vuitton', 'Prada', 'Samsung', 'LG', 'Hyundai',
  ],
};

// Sample Page Content
const samplePages: Record<string, unknown> = {
  home: {
    pageId: 'home',
    sections: [
      { sectionId: 'hero', title: 'Creative Excellence', subtitle: 'Redefining Fashion & Commerce', order: 1 },
      { sectionId: 'about', title: 'About Us', description: '우리는 크리에이티브 에이전시입니다.', order: 2 },
    ],
  },
  about: {
    pageId: 'about',
    sections: [
      { sectionId: 'story', title: 'Our Story', description: '2020년부터 시작된 우리의 여정', order: 1 },
      { sectionId: 'values', title: 'Our Values', order: 2 },
    ],
  },
};

// Sample Live Videos
const sampleLiveVideos: LiveVideo[] = [
  {
    id: '1',
    tag: 'Fashion Live',
    title: 'Summer Collection Launch',
    creator: 'Yuna Kim',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-for-a-photo-shoot-40291-large.mp4',
    label: 'Fashion & Beauty',
    infoTitle: '실시간 패션쇼로\n트렌드를 선도하다',
    desc: '라이브 커머스를 통해 최신 컬렉션을 실시간으로 선보이고, 시청자와 직접 소통하며 즉각적인 구매 전환을 이끌어냅니다.',
    stats: { views: '2.5M', conversion: '12.8%' },
    order: 1,
    active: true,
  },
  {
    id: '2',
    tag: 'Beauty Live',
    title: 'K-Beauty Masterclass',
    creator: 'Soo Min',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-putting-makeup-on-a-model-for-a-beauty-shoot-39880-large.mp4',
    label: 'Beauty Tutorial',
    infoTitle: '뷰티 라이브로\n브랜드 가치를 높이다',
    desc: '전문 메이크업 아티스트가 제품을 실시간으로 시연하고, 시청자의 질문에 즉시 답변하며 신뢰를 구축합니다.',
    stats: { views: '1.8M', conversion: '9.5%' },
    order: 2,
    active: true,
  },
  {
    id: '3',
    tag: 'Lifestyle Live',
    title: 'Urban Life Essentials',
    creator: 'Jin Park',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-over-a-city-background-2-41379-large.mp4',
    label: 'Lifestyle Content',
    infoTitle: '일상을 공유하며\n팬들과 함께하다',
    desc: '일상 브이로그 형식의 자연스러운 라이브로 팬덤을 구축하고, 진정성 있는 브랜드 메시지를 전달합니다.',
    stats: { views: '3.2M', conversion: '15.2%' },
    order: 3,
    active: true,
  },
];

// In-memory data store
class SampleDataStore {
  private models: Model[] = [...sampleModels];
  private creators: Creator[] = [...sampleCreators];
  private bookings: Booking[] = [...sampleBookings];
  private settings: Settings = { ...sampleSettings };
  private pages: Record<string, unknown> = { ...samplePages };
  private liveVideos: LiveVideo[] = [...sampleLiveVideos];
  private nextId = 100;

  // Helper to generate ID
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
}

// Singleton instance
export const sampleDataStore = new SampleDataStore();

// Check if we should use sample data (MongoDB unavailable)
export function shouldUseSampleData(): boolean {
  return process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI?.includes('mongodb');
}
