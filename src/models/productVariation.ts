import mongoose, { Document, Schema, Types } from 'mongoose';
import Product from './product';

export enum Size {
  SMALL = 'S',
  MEDIUM = 'M',
  LARGE = 'L',
  X_LARGE = 'XL',
  XX_LARGE = 'XXL',
}

interface PRODUCTVARIATION extends Document {
  productId: Types.ObjectId;
  color: string;
  size: Size;
  quantity: number;
}

const productVariationSchema = new Schema<PRODUCTVARIATION>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    color: { type: String, required: true },
    size: { type: String, enum: Object.values(Size), required: true },
    quantity: { type: Number, required: true },
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

const ProductVariation = mongoose.model(
  'productVariation',
  productVariationSchema
);
export default ProductVariation;
