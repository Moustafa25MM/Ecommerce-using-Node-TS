import mongoose, { Schema, Document, Types } from 'mongoose';
import User from './user';
import Product from './product';

interface WISHLIST extends Document {
  userId: Types.ObjectId;
  products: Types.ObjectId[];
}

const wishlistSchmea = new Schema<WISHLIST>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model('schema', wishlistSchmea);
export default Wishlist;
