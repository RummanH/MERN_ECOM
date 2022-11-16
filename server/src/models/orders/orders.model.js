const Order = require('./orders.mongo');

async function createOrder(currentOrder) {
  return await Order.create(currentOrder);
}

async function getOneOrder(_id) {
  return await Order.findById(_id);
}

async function getAllOrders(userId) {
  let filter = {};
  if (userId) filter = { user: userId };
  return await Order.find(filter).populate('user');
}

async function deleteOrder(_id) {
  return await Order.findByIdAndDelete(_id);
}

async function createBookingCheckout(_id) {
  const order = await getOneOrder(_id);
  order.isPaid = true;
  order.paidAt = Date.now();
  return await order.save();
}

async function updateOrder(_id, currentUpdate) {
  return await Order.findByIdAndUpdate(_id, currentUpdate, {
    new: true,
    runValidators: true,
  });
}

module.exports = {
  createOrder,
  getOneOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  createBookingCheckout,
};
