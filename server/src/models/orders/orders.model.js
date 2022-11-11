const orders = require('./orders.mongo');

async function createOrder(currentOrder) {
  return await orders.create(currentOrder);
}

async function getOneOrder({ _id, slug }) {
  let filter = {};
  if (slug) {
    filter = { slug };
  }
  if (_id) {
    filter = { _id };
  }
  return await orders.findOne(filter);
}

async function getAllOrders({ userId }) {
  let filter = {};
  if (userId) filter = { user: userId };
  return await orders.find(filter);
}

async function updateOrder(currentOrder) {
  const order = await getOneOrder({ _id: currentOrder._id });
  order.isPaid = true;
  order.paidAt = Date.now();
  return await order.save();
}

module.exports = { createOrder, getOneOrder, getAllOrders, updateOrder };
