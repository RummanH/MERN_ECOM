const { createOrder } = require('../../models/orders/orders.model');

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

module.exports = { httpCreateOrder };
