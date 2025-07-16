// index on model is for DB.
const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    payment_details: [
      {
        admin: {
          type: Schema.Types.ObjectId,
          ref: 'admin'
        },
        total: {
          type: Number
        },
        shipping_fee: {
          type: Number
        },
        product_count: {
          type: Number
        },
        unique_product_count: {
          type: Number
        }
      }
    ],

    total_shipping_fees: {
      type: Number
    },
    total_amount: {
      type: Number
    },
    session_id: {
      type: String
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: 'order'
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;
