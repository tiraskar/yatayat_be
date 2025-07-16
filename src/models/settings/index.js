const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const settingsSchema = new Schema(
  {
    expiryTimeBefore: {
      type: Number,
      required: true
    },
    timeUnit: {
      type: String,
      enum: ['minutes', 'hours', 'days', 'weeks'],
      required: true
    },
    tenure: {
      type: String
    },
    tenureStart: {
      type: Date
    },
    tenureEnd: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Settings = mongoose.model('settings', settingsSchema);

module.exports = Settings;
