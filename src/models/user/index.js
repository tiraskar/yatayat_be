// index on model is for DB.
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Ensures consistency
      trim: true
    },
    phoneNumber: {
      type: String,
      index: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      index: true,
      required: false
    },
    dob: {
      type: String
    },
    address: {
      address1: {
        type: String
      },
      country: {
        type: String
      },
      postalCode: {
        type: String
      },
      locality: {
        type: String
      },
      stateOrCity: {
        type: String
      },
      streetType: {
        type: String
      },
      streetName: {
        type: String
      },
      streetNumber: {
        type: String
      }
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    password: {
      type: String
    },
    membership: {
      type: Schema.Types.ObjectId,
      ref: 'membership'
    },
    membershipExpiryDate: {
      type: Date
    },
    isPaymentCompleted: {
      type: Boolean,
      default: false
    },
    expiryReminderSent: {
      type: Boolean,
      default: false
    },
    isKYCVerified: {
      type: Boolean,
      default: false
    },
    KYCdata: {},
    image: {
      type: String
    },
    isCertificateIssued: {
      type: Boolean,
      default: false
    },
    certificateIssuedDate: {
      type: Date
    },
    selectedPlan: {
      type: Schema.Types.ObjectId,
      ref: 'membership'
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });

const User = mongoose.model('user', userSchema);

module.exports = User;
