import { Request, Response } from 'express';
import { ORDER, orderControllers } from '../controllers/order';
import { cartControllers } from '../controllers/cart';
import { ORDERITEM, orderItemControllers } from '../controllers/orderItem';
import { productControllers } from '../controllers/product';
import { Types } from 'mongoose';

const createOrderFromCart = async (req: any, res: Response) => {
  try {
    const cart = await cartControllers.getByUserId(req.user.id);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const order: ORDER = {
      userId: cart.userId,
      status: 'pending',
      dateOrdered: new Date(),
      dateShipped: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
      dateDelivered: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
      totalPrice: 0,
    };

    const newOrder = await orderControllers.create(order);
    const orderItems: ORDERITEM[] = [];

    let totalPrice = 0;
    for (const item of cart.items) {
      const product = await productControllers.getById(item.productId);
      if (!product) continue;

      const orderItem = {
        productId: item.productId,
        quantity: item.quantity,
        orderId: newOrder._id as Types.ObjectId,
        price: product.price,
      };
      orderItems.push(orderItem);
      totalPrice += orderItem.price * item.quantity;
    }
    await orderItemControllers.createMany(orderItems);

    const { _id, userId, status, dateOrdered, dateShipped, dateDelivered } =
      newOrder;
    const updatedOrder = await orderControllers.update(String(_id), {
      userId,
      status,
      dateOrdered,
      dateShipped,
      dateDelivered,
      totalPrice,
    });
    await cartControllers.remove(userId);

    res.status(201).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const orderMiddlewares = {
  createOrderFromCart,
};
