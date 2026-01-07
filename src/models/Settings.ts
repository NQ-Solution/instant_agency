import mongoose, { Schema, Document } from 'mongoose';
import type { Settings as SettingsType } from '@/types';

export interface SettingsDocument extends Omit<SettingsType, '_id'>, Document {}

const SettingsSchema = new Schema<SettingsDocument>(
  {
    site: {
      name: { type: String, default: 'Instant Agency' },
      logo: String,
      tagline: String,
    },
    contact: {
      email: { type: String, default: 'contact@instant-agency.com' },
      phone: { type: String, default: '+82 2 1234 5678' },
      businessHours: { type: String, default: 'Mon - Fri, 10:00 - 19:00' },
    },
    offices: [
      {
        city: String,
        address: String,
      },
    ],
    social: {
      instagram: String,
      linkedin: String,
      twitter: String,
      youtube: String,
    },
    partners: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings ||
  mongoose.model<SettingsDocument>('Settings', SettingsSchema);
