const mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startAmount: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  durationDays: { type: Number, required: true },
  spendingLimits: {
    groceries: { type: Number, required: true },
    bills: { type: Number, required: true },
    entertainment: { type: Number, required: true },
    unexpected: { type: Number, required: true },
    medical: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Planner', plannerSchema);
