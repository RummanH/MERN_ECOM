const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
  });

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
}

async function httpGetAllOrders(req, res, next) {
  const orders = await getAllOrders(req.params.userId);
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

module.exports = {
  httpCreateOrder,
  httpGetAllOrders,
  httpGetOneOrder,
  httpUpdateOrder,
  httpDeleteOrder,
  httpCreateBookingCheckout,
  httpGetCheckoutSession,
  httpPayWithPayPal,
};
