const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category must have a name!'],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = model('Category', categorySchema);
module.exports = Category;
