const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ORDER_STATUS_DB_ENUM, ORDER_STATUS } = require('../../constant/enum');

const cartSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'admin',
      required: true
    },
    status: {
      type: String,
      enum: ORDER_STATUS_DB_ENUM,
      default: ORDER_STATUS.ORDER_PLACED,
      index: true
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'product',
          required: true
        },
        count: {
          type: Number,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
