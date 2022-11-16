const stripe = require('stripe')(
  'sk_test_51Ltb6YAGTu4kgviAWqSJUfApaC8xx9r6409guRcArLuYneQ9x88RCynR6krioxWwufiOqpjxLfhBT6eLcYnYj00400CXf66XHi'
);

const {
  createOrder,
  getOneOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  createBookingCheckout,
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

async function httpGetOneOrder(req, res, next) {
  const order = await getOneOrder(req.params._id);

  if (!order) {
    return next(new AppError('Order not found!', 404));
  }

  return res.status(200).json({ status: 'success', data: { order } });
}

async function httpPayOrder(req, res, next) {
  const order = await getOneOrder(req.params._id);
  if (!order) {
    return next(new AppError('No order found', 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order paid',
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

async function httpGetCheckoutSession(req, res, next) {
  const order = await getOneOrder({ _id: req.params.orderId });

  const items = order.orderItems.map((x) => {
    return {
      price_data: {
        currency: 'usd',
        unit_amount: x.price * 100,
        product_data: {
          name: x.name,
          description: x.description,
          images: [
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1597763166-41CRnvYqmqL.jpg?crop=1xw:1.00xh;center,top&resize=480:*',
          ],
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
    shipping_address_collection: { allowed_countries: ['US', 'CA'] },
    mode: 'payment',
    line_items: items,
  });

  res.status(200).json({
    status: 'success',
    session,
  });
}

async function httpDeleteOrder(req, res, next) {
  await deleteOrder(req.params._id);
  return res.status(200).json({ status: 'success', data: null });
}

async function httpUpdateOrder(req, res, next) {
  const order = await updateOrder(req.params._id, req.body);
  if (!order) {
    return next(new AppError('Order not found!', 404));
  }

  return res.status(200).json({ status: 'success', data: { order } });
}

async function httpCreateBookingCheckout(req, res, next) {
  await createBookingCheckout(req.params._id);
  res.status(200).json({ status: 'success' });
}

module.exports = {
  httpCreateOrder,
  httpGetOneOrder,
  httpPayOrder,
  httpGetAllOrders,
  httpGetCheckoutSession,
  httpCreateBookingCheckout,
  httpDeleteOrder,
  httpUpdateOrder,
};
