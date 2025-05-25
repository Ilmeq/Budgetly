require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authenticateToken = require('./middleware/authMiddleware');

// Import models
const Expense = require('./models/Expense');
const Income = require('./models/Income');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Planner routes (merged planner + progress)
const plannerRoutes = require('./routes/planner');
app.use('/api/planner', plannerRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/budgetly', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Get all expenses & incomes for logged-in user
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const expenses = await Expense.find({ userId }).lean();
    const incomes = await Income.find({ userId }).lean();

    const combined = [
      ...expenses.map(e => ({ ...e, type: 'expense' })),
      ...incomes.map(i => ({ ...i, type: 'income' })),
    ];

    combined.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(combined);
  } catch (err) {
    console.error('❌ Error fetching records:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// Add a new expense
app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const newExpense = new Expense({
      ...req.body,
      userId: req.user.userId,
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.error('❌ Error saving expense:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// Add a new income
app.post('/api/incomes', authenticateToken, async (req, res) => {
  try {
    const newIncome = new Income({
      ...req.body,
      userId: req.user.userId,
    });
    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (err) {
    console.error('❌ Error saving income:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// DELETE expense by id
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenseId = req.params.id;

    const deleted = await Expense.findOneAndDelete({ _id: expenseId, userId });

    if (!deleted) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting expense:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// DELETE income by id
app.delete('/api/incomes/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const incomeId = req.params.id;

    const deleted = await Income.findOneAndDelete({ _id: incomeId, userId });

    if (!deleted) {
      return res.status(404).json({ error: 'Income not found or unauthorized' });
    }

    res.json({ message: 'Income deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting income:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 
















