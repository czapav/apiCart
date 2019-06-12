const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
      type: String,
      required: [true, 'user_id required']
    },
    products: {type: Array, "default": []},
    date_add: {
      type: Date,
      default:
        Date.now()
    }
  })
;

module.exports = mongoose.model('Cart', cartSchema);
