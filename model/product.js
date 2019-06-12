const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Field name required']
  },
  category: {
    type: String,
    required: [true, 'Field name required']
  },
  price: {
    type: Number,
    required: [true, 'Field name required']
  },
  imgUrl: {
    type: String,
    required: [true, 'Field name required']
  },
  dateAdd: {
    type: Date,
    default: Date.now()
  },
  quantity: {
    required: false
  }
});

module.exports = mongoose.model('Product', productSchema);
