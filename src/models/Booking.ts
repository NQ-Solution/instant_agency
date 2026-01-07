import mongoose, { Schema, Document } from 'mongoose';
import type { Booking as BookingType } from '@/types';

export interface BookingDocument extends Omit<BookingType, '_id'>, Document {}

const BookingSchema = new Schema<BookingDocument>(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    endTime: String,
    service: { type: String, required: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      company: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ date: 1, status: 1 });
BookingSchema.index({ 'customer.email': 1 });

export default mongoose.models.Booking ||
  mongoose.model<BookingDocument>('Booking', BookingSchema);
