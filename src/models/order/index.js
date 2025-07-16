// index on model is for DB.
const mongoose = require('mongoose');
const {
  ORDER_STATUS_DB_ENUM,
  ORDER_STATUS,
  PAYMENT_STATUS_DB_ENUM,
  PAYMENT_STATUS
} = require('../../constant/enum');

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    amount: {
      type: Number,
      required: true
    },
    requestId: {
      type: String
    },
    status: {
      type: String
    },
    paymentType: {
      type: String
    },
    membership: {
      type: Schema.Types.ObjectId,
      ref: 'membership'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('order', orderSchema);

module.exports = Order;
