import mongoose, { Document, Schema } from 'mongoose';

interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  status: 'pending' | 'shipped' | 'delivered';
  dateOrdered: Date;
  dateShipped: Date;
  dateDelivered: Date;
  totalPrice: number;
}

interface IOrderItem extends Document {
  productId: Schema.Types.ObjectId;
  price: number;
  quantity: number;
  orderId: Schema.Types.ObjectId;
}

const orderSchema: Schema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending',
  },
  dateOrdered: { type: Date, default: Date.now },
  dateShipped: { type: Date },
  dateDelivered: { type: Date },
  totalPrice: { type: Number, required: true },
});

const orderItemSchema: Schema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('order', orderSchema);
export const OrderItems = mongoose.model('orderitems', orderItemSchema);
