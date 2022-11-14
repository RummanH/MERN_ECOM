const Category = require('./categories.mongo');

async function createCategory(currentCategory) {
  return await Category.create(currentCategory);
}

async function getAllCategories() {
  return await Category.find();
}

module.exports = { createCategory, getAllCategories };
