const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name.'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Product must have a description.'],
    },
    slug: { type: String, unique: true },
    image: { type: String, required: true },
    brand: { type: String, required: [true, 'Product must have a brand.'] },
    category: {
      type: String,
      required: [true, 'Product must have a category.'],
    },
    price: { type: Number, required: [true, 'Product must have a price.'] },
    countInStock: {
      type: Number,
      required: [true, 'Product must have countInStock.'],
    },
    rating: { type: Number, required: [true, 'Product must have a rating.'] },
    numReviews: {
      type: Number,
      required: [true, 'Product must have numReviews.'],
    },
  },
  {
    //will create createdAt and updatedAt
    timestamps: true,
  }
);

//document middleware will run before any document being saved
//only run before save and create command
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lowercase: true });
  next();
});

module.exports = mongoose.model('Product', productSchema);
