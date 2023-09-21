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

const getOrdersByUserId = async (req: any, res: Response) => {
  const userId = req.user.id;
  try {
    const orders = await orderControllers.getByUserId(userId);
    if (!orders) {
      return res.status(400).json({ message: 'no orders for that users' });
    }
    const orderItems = [];
    for (const order of orders) {
      const items = await orderItemControllers.getByOrderId(String(order._id));
      orderItems.push(items);
    }
    return res.status(200).json(orderItems);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getOrdersByProductId = async (req: any, res: Response) => {
  const productId = req.params.id;
  try {
    const product = await productControllers.getById(productId);
    if (!product) {
      return res.status(400).json({ message: 'no Product found!' });
    }
    const orders = await orderItemControllers.getByProductId(productId);
    const users = [];
    for (const order of orders) {
      const item = await orderControllers.getByOrderId(String(order.orderId));
      const userId = item?.userId;
      users.push(userId);
    }
    if (!orders) {
      return res
        .status(500)
        .json({ message: 'no orders done for that product' });
    }
    return res.status(200).json({ orders: orders, users: users });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const orderMiddlewares = {
  createOrderFromCart,
  getOrdersByUserId,
  getOrdersByProductId,
};
