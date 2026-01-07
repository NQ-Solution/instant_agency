import mongoose, { Schema, Document } from 'mongoose';
import type { Creator as CreatorType } from '@/types';

export interface CreatorDocument extends Omit<CreatorType, '_id'>, Document {}

const CreatorSchema = new Schema<CreatorDocument>(
  {
    name: { type: String, required: true },
    platform: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    followers: { type: String, required: true },
    views: { type: String, required: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

CreatorSchema.index({ active: 1, order: 1 });
CreatorSchema.index({ featured: 1, active: 1 });

export default mongoose.models.Creator ||
  mongoose.model<CreatorDocument>('Creator', CreatorSchema);
