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
  portfolioPdf?: string;
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
  linkedin?: string;
  twitter?: string;
  youtube?: string;
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
}

export interface Booking {
  id: string;
  date: Date;
  time: string;
  endTime?: string;
  service: string;
  customer: BookingCustomer;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
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
