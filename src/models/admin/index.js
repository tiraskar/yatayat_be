// index on model is for DB.
const mongoose = require('mongoose');

const { Schema } = mongoose;

const adminSchame = new Schema(
  {
    profile: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    email: {
      type: String,
      required: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true
    },
    website_link: {
      type: String
    },
    phone_number: {
      type: Number
    },
    location: {
      type: String
    },
    rating: {
      type: Number
    },
    area_square_km: {
      type: Number
    },
    active: {
      type: Boolean,
      default: false
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'role'
    },
    fcmToken: {
      type: String
    },
    isSuperAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Admin = mongoose.model('admin', adminSchame);

module.exports = Admin;
