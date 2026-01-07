import mongoose, { Schema, Document } from 'mongoose';
import type { LiveVideo as LiveVideoType } from '@/types';

export interface LiveVideoDocument extends Omit<LiveVideoType, '_id'>, Document {}

const LiveVideoSchema = new Schema<LiveVideoDocument>(
  {
    tag: { type: String, required: true },
    title: { type: String, required: true },
    creator: { type: String, required: true },
    videoUrl: { type: String, required: true },
    label: { type: String, required: true },
    infoTitle: { type: String, required: true },
    desc: { type: String, required: true },
    stats: {
      views: { type: String, default: '0' },
      conversion: { type: String, default: '0%' },
    },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.LiveVideo ||
  mongoose.model<LiveVideoDocument>('LiveVideo', LiveVideoSchema);
