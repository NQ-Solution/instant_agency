import mongoose, { Schema, Document } from 'mongoose';
import type { Page as PageType } from '@/types';

export interface PageDocument extends Omit<PageType, '_id'>, Document {}

const PageSchema = new Schema<PageDocument>(
  {
    pageId: {
      type: String,
      required: true,
      unique: true,
      enum: ['home', 'about', 'models', 'studio', 'live', 'contact'],
    },
    sections: [
      {
        sectionId: { type: String, required: true },
        title: String,
        subtitle: String,
        description: String,
        items: { type: Schema.Types.Mixed },
        order: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Page ||
  mongoose.model<PageDocument>('Page', PageSchema);
