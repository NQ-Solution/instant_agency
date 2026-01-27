// Model types
export interface ModelStats {
  height?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoes?: string;
  eyes?: string;
  hair?: string;
}

export interface ModelExperience {
  brand: string;
  year: string;
  type?: string;
}

export interface ModelSocial {
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  portfolioPdf?: string;
}

export interface ModelVideo {
  url: string;
  thumbnail?: string;
  title?: string;
  type?: 'youtube' | 'vimeo' | 'upload';
}

export interface Model {
  id: string;
  name: string;
  nameKr?: string;
  slug: string;
  category: 'women' | 'men' | 'new';
  featured: boolean;
  profileImage: string;
  galleryImages: string[];
  galleryVideos?: ModelVideo[];
  stats: ModelStats;
  location: string;
  bio?: string;
  experience: ModelExperience[];
  social: ModelSocial;
  active: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Page content types
export interface PageSection {
  sectionId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  items?: unknown[];
  order: number;
}

export interface Page {
  id: string;
  pageId: string;
  sections: PageSection[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Settings types
export interface Office {
  city: string;
  address: string;
}

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface BusinessInfo {
  businessNumber?: string;       // 사업자등록번호
  businessName?: string;         // 상호명
  representative?: string;       // 대표자명
  businessAddress?: string;      // 사업장 주소
  ecommerceNumber?: string;      // 통신판매업 신고번호
  hostingProvider?: string;      // 호스팅 서비스 제공자
}

export interface PageVisibility {
  home?: boolean;
  about?: boolean;
  models?: boolean;
  studio?: boolean;
  live?: boolean;
  contact?: boolean;
}

// Booking Settings types
export interface BookingSettings {
  id?: string;
  availableTimes: string[];           // ['09:00', '10:00', ...]
  blockedDates: string[];             // ['2025-01-15', '2025-01-20', ...]
  blockedWeekdays: number[];          // [0, 6] for Sunday and Saturday
  minAdvanceHours: number;            // Minimum hours in advance for booking
  maxAdvanceDays: number;             // Maximum days in advance for booking
  slotDuration: number;               // Duration in minutes (default 60)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Settings {
  id: string;
  site: {
    name: string;
    logo?: string;
    tagline?: string;
  };
  contact: {
    email: string;
    phone: string;
    businessHours: string;
  };
  business?: BusinessInfo;
  pageVisibility?: PageVisibility;
  offices: Office[];
  social: SocialLinks;
  partners: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Booking types
export interface BookingCustomer {
  name: string;
  email: string;
  phone: string;
  company?: string;
  instagram?: string;
  tiktok?: string;
}

export interface Booking {
  id: string;
  date: Date;
  time: string;
  endTime?: string;
  service: string;
  customer: BookingCustomer;
  kakaoId?: string;              // 카카오톡 ID
  isUniversityStudent?: boolean; // 대학생 여부
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Inquiry types
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  createdAt?: Date;
  updatedAt?: Date;
}

// Creator types
export interface Creator {
  id: string;
  name: string;
  platform: string;
  category: string;
  image: string;
  followers: string;
  views: string;
  featured: boolean;
  order: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Live Video types
export interface LiveVideoStats {
  views: string;
  conversion: string;
}

export interface LiveVideo {
  id: string;
  tag: string;
  title: string;
  creator: string;
  videoUrl: string;
  label: string;
  infoTitle: string;
  desc: string;
  stats: LiveVideoStats;
  order: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Home Page Content types
export interface HeroSection {
  title: string;
  subtitle: string;
  scrollText: string;
}

export interface DivisionItem {
  id: string;
  number: string;
  title: string;
  desc: string;
  image: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface AboutPreview {
  sectionNumber: string;
  title: string;
  description: string;
  image: string;
  stats: StatItem[];
}

export interface CTASection {
  sectionNumber: string;
  title: string;
  email: string;
  socialLinks: { label: string; href: string }[];
  offices: { title: string; address: string }[];
}

export interface VideoSection {
  sectionNumber: string;
  title: string;
  subtitle: string;
  videoType: 'youtube' | 'vimeo' | 'upload';
  videoUrl: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export interface HomePageContent {
  hero: HeroSection;
  divisions: {
    sectionNumber: string;
    title: string;
    items: DivisionItem[];
  };
  talents: {
    sectionNumber: string;
    title: string;
    buttonText: string;
  };
  stats: StatItem[];
  video?: VideoSection;
  about: AboutPreview;
  cta: CTASection;
}

// About Page Content
export interface AboutPageContent {
  hero: {
    label: string;
    title: string;
    subtitle: string;
  };
  story: {
    image: string;
    title: string;
    paragraphs: string[];
  };
  values: {
    title: string;
    items: { icon: string; title: string; desc: string }[];
  };
  timeline: {
    title: string;
    subtitle: string;
    items: { year: string; title: string; desc: string }[];
  };
  cta: {
    title: string;
    buttonText: string;
  };
  // Section visibility
  sectionVisibility?: {
    hero?: boolean;
    story?: boolean;
    values?: boolean;
    timeline?: boolean;
    cta?: boolean;
  };
}

// Studio Page Content
export interface StudioPageContent {
  hero: {
    tag: string;
    label: string;
    title: string;
    subtitle: string;
  };
  info: {
    image: string;
    label: string;
    title: string;
    description: string;
    features: string[];
    linkText: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  // Section visibility
  sectionVisibility?: {
    hero?: boolean;
    info?: boolean;
    cta?: boolean;
  };
}

// Live Page Content
export interface LiveServiceItem {
  num: string;
  title: string;
  desc: string;
  features: string[];
}

export interface LiveShowcaseItem {
  label: string;
  title: string;
  desc: string;
  features: string[];
  image: string;
}

export interface LiveStatItem {
  value: string;
  label: string;
}

export interface LivePageContent {
  hero: {
    tag: string;
    label: string;
    title: string;
    subtitle: string;
  };
  services: LiveServiceItem[];
  showcase: LiveShowcaseItem[];
  stats: LiveStatItem[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  // Section visibility
  sectionVisibility?: {
    hero?: boolean;
    videos?: boolean;
    services?: boolean;
    showcase?: boolean;
    creators?: boolean;
    stats?: boolean;
    cta?: boolean;
  };
}

// Models Page Content
export interface ModelsPageContent {
  hero: {
    tag: string;
    label: string;
    title: string;
    subtitle: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

// Contact Page Content
export interface ContactPageContent {
  hero: {
    label: string;
    title: string;
    subtitle: string;
  };
  info: {
    email: string;
    businessHours: string;
  };
  offices: { city: string; address: string; phone: string }[];
  map: {
    title: string;
    subtitle: string;
    embedUrl: string;
    address: string;
    directionsUrl: string;
  };
}
