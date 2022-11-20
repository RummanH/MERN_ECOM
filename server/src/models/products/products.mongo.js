const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name.'],
    },
    description: {
      type: String,
      required: [true, 'Product must have a description.'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slug: { type: String, unique: true },
    image: { type: String, required: true },
    brand: { type: String, required: [true, 'Product must have a brand.'] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must have a category.'],
    },
    price: { type: Number, required: [true, 'Product must have a price.'] },
    countInStock: {
      type: Number,
      required: [true, 'Product must have countInStock.'],
    },
    rating: {
      type: Number,
      required: [true, 'Product must have a rating.'],
      default: 4.5,
    },
    numReviews: {
      type: Number,
      required: [true, 'Product must have numReviews.'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre(/^find/, function (next) {
  this.populate('category');
  next();
});
productSchema.pre(/^find/, function (next) {
  this.populate('seller');
  next();
});
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lowercase: true });
  next();
});

module.exports = mongoose.model('Product', productSchema);
