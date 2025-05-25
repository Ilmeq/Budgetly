const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  date: Date,
  category: String,
  amount: Number,
  title: String,
  message: String,
});

module.exports = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);




