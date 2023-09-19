import mongoose, { Document, Schema, Types } from 'mongoose';
import Category from './category';

interface PRODUCT extends Document {
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: Types.ObjectId | Category;
}

const productSchema = new Schema<PRODUCT>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  }
);

const Product = mongoose.model('product', productSchema);
export default Product;
