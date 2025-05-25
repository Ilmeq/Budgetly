const mongoose = require('mongoose');

const PlannerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
  initialAmount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  categories: [
    {
      category: { type: String, required: true },
      limit: { type: Number, default: 0 },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Planner', PlannerSchema);

