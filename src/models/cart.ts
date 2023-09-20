import mongoose, { Schema, Document, Types } from 'mongoose';

interface Cart extends Document {
  userId: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
}

const cartSchema: Schema<Cart> = new Schema<Cart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
