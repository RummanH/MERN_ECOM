const Order = require('./orders.mongo');

async function createOrder(currentOrder) {
  return await Order.create(currentOrder);
}

async function getOneOrder(_id) {
  return await Order.findById(_id);
}

async function getAllOrders() {
  return await Order.find();
}

async function updateOrder(_id) {
  const order = await getOneOrder(_id);
  order.isPaid = true;
  order.paidAt = Date.now();
  return await order.save();
}

module.exports = { createOrder, getOneOrder, getAllOrders, updateOrder };
