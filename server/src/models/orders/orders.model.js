const Order = require('./orders.mongo');

async function createOrder(currentOrder) {
  return await Order.create(currentOrder);
}

async function getAllOrders(userId) {
  let filter = {};
  if (userId) filter = { user: userId };
  return await Order.find(filter).populate('user');
}

async function getOneOrder(_id) {
  return await Order.findById(_id);
}

//for admin to to something i.e deliver order
async function updateOrder(_id, currentUpdate) {
  return await Order.findByIdAndUpdate(_id, currentUpdate, {
    new: true,
    runValidators: true,
  });
}

async function deleteOrder(_id) {
  return await Order.findByIdAndDelete(_id);
}

// async function createBookingCheckout(_id) {
//   const order = await getOneOrder(_id);
//   order.isPaid = true;
//   order.paidAt = Date.now();
//   return await order.save();
// }

async function payOrder(_id) {
  return await Order.findByIdAndUpdate(
    _id,
    {
      isPaid: true,
      paidAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // order.paymentResult = {
  //   id: req.body.id,
  //   status: req.body.status,
  //   update_time: req.body.update_time,
  //   email_address: req.body.email_address,
  // };
}

module.exports = {
  createOrder,
  getOneOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  payOrder,
};
