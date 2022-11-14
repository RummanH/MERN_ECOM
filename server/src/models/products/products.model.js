const ApiFeatures = require('../../services/ApiFeatures');
const Product = require('./products.mongo');

async function getAllProducts(queryString) {
  const features = new ApiFeatures(Product.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  if (queryString.search) {
    const { search } = queryString;
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    features.query.find(searchFilter);
  }

  return await features.query;
}

async function getOneProductById(_id) {
  return await Product.findById(_id);
}

async function getOneProductBySlug(slug) {
  return await Product.findOne({ slug });
}

module.exports = { getAllProducts, getOneProductBySlug, getOneProductById };
