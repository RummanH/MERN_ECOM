const {
  createCategory,
  getAllCategories,
} = require('../models/categories/categories.model');

async function httpCreateCategory(req, res, next) {
  const category = await createCategory(req.body);
  return res.status(201).json({ status: 'success', data: { category } });
}

async function httpGetAllCategories(req, res, next) {
  const categories = await getAllCategories();
  return res.status(200).json({ status: 'success', data: { categories } });
}

module.exports = { httpCreateCategory, httpGetAllCategories };
