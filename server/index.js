require('dotenv').config(); // Load variables from .env

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with options and logging
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

// Define Expense schema and model
const ExpenseSchema = new mongoose.Schema({
  date: Date,
  category: String,
  amount: Number,
  title: String,
  message: String,
});

const Expense = mongoose.model('Expense', ExpenseSchema);

const IncomeSchema = new mongoose.Schema({
  date: Date,
  category: String,
  amount: Number,
  title: String,
  message: String,
});

const Income = mongoose.model('Income', IncomeSchema);

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// ✅ Route to fetch all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().lean();
    const incomes = await Income.find().lean();

    const combined = [...expenses.map(e => ({ ...e, type: 'expense' })), 
                      ...incomes.map(i => ({ ...i, type: 'income' }))];

    // Sort by date, newest first
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(combined);
  } catch (err) {
    console.error('❌ Error fetching records:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// ✅ Route to add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.error('❌ Error saving expense:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

app.post('/api/incomes', async (req, res) => {
  try {
    const newIncome = new Income(req.body);
    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (err) {
    console.error('❌ Error saving income:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// Start server after DB is ready
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});






