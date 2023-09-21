import mongoose, { Document, Schema, Types } from 'mongoose';

interface Review extends Document {
  userId: Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const ReviewSchema = new Schema<Review>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
});

export const Review = mongoose.model<Review>('Review', ReviewSchema);
