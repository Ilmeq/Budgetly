const express = require('express');
const router = express.Router();
const Planner = require('../models/Planner');

// Create new plan
router.post('/', async (req, res) => {
  const { userId, startAmount, durationDays, spendingLimits } = req.body;

  if (!userId || !startAmount || !durationDays || !spendingLimits) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newPlan = new Planner({
      userId,
      startAmount,
      durationDays,
      spendingLimits,
    });

    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan', error });
  }
});

// Get user's current plan
router.get('/:userId', async (req, res) => {
  try {
    const plan = await Planner.findOne({ userId: req.params.userId }).sort({ createdAt: -1 });
    if (!plan) return res.status(404).json({ message: 'No plan found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan', error });
  }
});

module.exports = router;
