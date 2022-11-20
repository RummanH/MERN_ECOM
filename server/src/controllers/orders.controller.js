const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const _ = require('lodash');

const Order = require('../models/orders/orders.mongo');

const {
  createOrder,
  getOneOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  payOrder,
} = require('../models/orders/orders.model');
const AppError = require('../services/AppError');

async function httpCreateOrder(req, res, next) {
  const order = await createOrder({
    orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.user._id,
    seller: req.body.orderItems[0].seller,
  });

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
}

async function httpGetAllOrders(req, res, next) {
  if (!req.query.seller) {
    req.query = _.omit(req.query, 'seller');
  }

  console.log(req.query);

  const orders = await getAllOrders(req.params.userId, req.query);

  console.log(orders.length);
  return res
    .status(200)
    .json({ status: 'success', results: orders.length, data: { orders } });
}

async function httpGetOneOrder(req, res, next) {
  const order = await getOneOrder(req.params._id);

  if (!order) {
    return next(new AppError('Order not found!', 404));
  }

  return res.status(200).json({ status: 'success', data: { order } });
}

async function httpUpdateOrder(req, res, next) {
  const order = await updateOrder(req.params._id, req.body);
  if (!order) {
    return next(new AppError('Order not found!', 404));
  }

  return res.status(200).json({ status: 'success', data: { order } });
}

async function httpDeleteOrder(req, res, next) {
  await deleteOrder(req.params._id);
  return res.status(200).json({ status: 'success', data: null });
}

async function httpGetCheckoutSession(req, res, next) {
  const order = await getOneOrder(req.params.orderId);

  const items = order.orderItems.map((x) => {
    return {
      price_data: {
        currency: 'usd',
        unit_amount: x.price * 100,
        product_data: {
          name: x.name,
          description: x.description,
          images: [x.image],
        },
      },

      quantity: x.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `http://localhost:3000/order/${req.params.orderId}/true`,
    cancel_url: `http://localhost:3000/order/${req.params.orderId}/false`,
    customer_email: req.user.email,
    client_reference_id: req.params.orderId,
    mode: 'payment',
    line_items: items,
  });

  res.status(200).json({
    status: 'success',
    session,
  });
}

async function httpCreateBookingCheckout(req, res, next) {
  const order = await payOrder(req.params._id);
  res.status(200).json({ status: 'success', data: { order } });
}

async function httpPayWithPayPal(req, res, next) {
  const order = await payOrder(req.params._id);
  if (!order) {
    return next(new AppError('Order not found!', 404));
  }

  return res.status(200).json({
    status: 'success',
    message: 'Order paid',
    data: {
      order,
    },
  });
}

//TEST AGGREGATION ----------------------

async function httpAddFields(req, res, next) {
  // const result = await Order.aggregate([
  //   {
  //     $addFields: {
  //       numOrders: {
  //         $add: ['$itemsPrice', '$shippingPrice', '$taxPrice'],
  //       },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       'orderItems.numItems': 'ok',
  //     },
  //   },
  // ]);

  // console.log(result[0].orderItems);

  // const result = await Order.aggregate([
  //   {
  //     $bucket: {
  //       groupBy: '$totalPrice',
  //       boundaries: [1, 25, 60, 100],
  //       default: 'Others',
  //     },
  //   },
  // ]);

  const result = await Order.aggregate([
    {
      $group: {
        _id: '$user',
        count: { $count: {} },
        avgBuy: {
          $avg: {
            $multiply: ['$totalPrice', '$count'],
          },
        },
      },
    },
  ]);

  console.log(result);
  res.send('k');
}

module.exports = {
  httpCreateOrder,
  httpGetAllOrders,
  httpGetOneOrder,
  httpUpdateOrder,
  httpDeleteOrder,
  httpCreateBookingCheckout,
  httpGetCheckoutSession,
  httpPayWithPayPal,
  httpAddFields,
};
