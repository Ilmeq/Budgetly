const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Planner = require('../models/Planner');
const Expense = require('../models/Expense');

// POST route to save/update planner
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { initialAmount, startDate, endDate, categories } = req.body;

    if (!initialAmount || !startDate || !endDate || !categories) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const planner = await Planner.findOneAndUpdate(
      { userId },
      { initialAmount, startDate, endDate, categories },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(planner);
  } catch (error) {
    console.error(" Error saving planner:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /planner/progress route
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date();

    const activePlanner = await Planner.findOne({
      userId,
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    if (!activePlanner) {
      return res.status(404).json({ message: 'No active planner found' });
    }

    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          userId: activePlanner.userId,
          date: {
            $gte: new Date(activePlanner.startDate),
            $lte: new Date(activePlanner.endDate),
          },
          category: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const progress = {};
    activePlanner.categories.forEach((cat) => {
      progress[cat.category] = {
        limit: cat.limit,
        spent: 0
      };
    });

    expensesByCategory.forEach((item) => {
      if (progress[item._id]) {
        progress[item._id].spent = item.totalSpent;
      }
    });

    // ** New notifications calculation logic **
    const notifications = [];

    let allCategoriesExceeded = true;

    activePlanner.categories.forEach((cat) => {
      const catProgress = progress[cat.category];
      if (!catProgress) return;

      const { spent, limit } = catProgress;
      if (limit === 0) return; // avoid division by zero

      const percentSpent = (spent / limit) * 100;

      // Track if this category is NOT exceeded
      if (percentSpent <= 100) allCategoriesExceeded = false;

      if (percentSpent >= 100) {
        notifications.push(
          `You have exceeded your spending limit in "${cat.category}", reduce your spending in other categories!`
        );
      } else if (percentSpent >= 90) {
        notifications.push(
          `Warning: You have spent 90% of your set amount limit in "${cat.category}"!`
        );
      } else if (percentSpent >= 80) {
        notifications.push(
          `Warning: You have spent 80% of your set amount limit in "${cat.category}"!`
        );
      }
    });

    if (allCategoriesExceeded && activePlanner.categories.length > 0) {
      notifications.push("You have exceeded spending in all categories, add some income!");
    }

    res.json({ categories: progress, notifications });
  } catch (error) {
    console.error(' Error in /planner/progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;










