import mongoose, { Schema, Document } from 'mongoose';
import type { Model as ModelType } from '@/types';

export interface ModelDocument extends Omit<ModelType, '_id'>, Document {}

const ModelSchema = new Schema<ModelDocument>(
  {
    name: { type: String, required: true },
    nameKr: { type: String },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['women', 'men', 'new'],
      required: true,
    },
    featured: { type: Boolean, default: false },
    profileImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    stats: {
      height: { type: String, required: true },
      bust: String,
      waist: String,
      hips: String,
      shoes: String,
      eyes: String,
      hair: String,
    },
    location: { type: String, default: 'Seoul' },
    bio: { type: String },
    experience: [
      {
        brand: String,
        year: String,
        type: String,
      },
    ],
    social: {
      instagram: String,
      portfolioPdf: String,
    },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

ModelSchema.index({ category: 1, active: 1, order: 1 });
ModelSchema.index({ featured: 1, active: 1 });

export default mongoose.models.Model ||
  mongoose.model<ModelDocument>('Model', ModelSchema);
