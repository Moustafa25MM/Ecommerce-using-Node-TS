import { Request, Response } from 'express';
import { ORDER, orderControllers } from '../controllers/order';
import { cartControllers } from '../controllers/cart';
import { ORDERITEM, orderItemControllers } from '../controllers/orderItem';
import { productControllers } from '../controllers/product';
import { Types } from 'mongoose';
import { paginationOption } from '../libs/pagination';

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
      dateShipped: null,
      dateDelivered: null,
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
      return res.status(400).json({ message: 'no orders for that user' });
    }
    const ordersWithProductData = [];
    for (const order of orders) {
      const items = await orderItemControllers.getByOrderId(String(order._id));
      const orderWithProduct = {
        ...order.toObject(),
        products: await Promise.all(
          items.map(async (item: any) => {
            return {
              ...item.toObject(),
            };
          })
        ),
      };
      ordersWithProductData.push(orderWithProduct);
    }
    let pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 5;
    pageSize = Math.min(20, pageSize);
    const totalDocs = ordersWithProductData.length;
    const maxPageNumber = Math.ceil(totalDocs / pageSize);

    let pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber as string)
      : 1;
    pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
    const paginatedOrders = ordersWithProductData.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);
    return res.status(200).json({
      pagination: paginationOptions,
      orders: paginatedOrders,
    });
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
    const ordersWithProductData = [];
    for (const order of orders) {
      const item = await orderControllers.getByOrderId(String(order.orderId));
      const userId = item?.userId;
      const orderWithProduct = { ...order.toObject(), userId, product };
      ordersWithProductData.push(orderWithProduct);
    }
    if (!orders) {
      return res
        .status(500)
        .json({ message: 'no orders done for that product' });
    }
    let pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 5;
    pageSize = Math.min(20, pageSize);
    const totalDocs = ordersWithProductData.length;
    const maxPageNumber = Math.ceil(totalDocs / pageSize);

    let pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber as string)
      : 1;
    pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
    const paginatedOrders = ordersWithProductData.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);
    return res.status(200).json({
      pagination: paginationOptions,
      orders: paginatedOrders,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const shipOrder = async (req: any, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderControllers.getByOrderId(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res
        .status(400)
        .json({ error: 'Invalid order status for shipping' });
    }

    order.status = 'shipped';
    order.dateShipped = new Date(); // Set the current date as the shipping date
    await order.save();

    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const deliverOrder = async (req: any, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderControllers.getByOrderId(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'shipped') {
      return res
        .status(400)
        .json({ error: 'Invalid order status for delivery' });
    }

    order.status = 'delivered';
    order.dateDelivered = new Date(); // Set the current date as the delivery date
    await order.save();

    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const orderMiddlewares = {
  createOrderFromCart,
  getOrdersByUserId,
  getOrdersByProductId,
  shipOrder,
  deliverOrder,
};
