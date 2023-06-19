const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true
  }
});

const products = mongoose.model('products', productSchema);

module.exports = products;
