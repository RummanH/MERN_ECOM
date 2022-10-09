const orders = require('./orders.mongo');

async function createOrder(currentOrder) {
  return await orders.create(currentOrder);
}

module.exports = { createOrder };
