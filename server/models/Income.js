const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  date: Date,
  category: String,
  amount: Number,
  title: String,
  message: String,
});

module.exports = mongoose.models.Income || mongoose.model('Income', IncomeSchema); 
