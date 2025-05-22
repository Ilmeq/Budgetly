const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with options and logging
mongoose.connect('mongodb://127.0.0.1:27017/budgetly', {
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

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// ✅ Route to fetch all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }); // latest first
    res.json(expenses);
  } catch (err) {
    console.error('❌ Error fetching expenses:', err);
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

// Start server after DB is ready
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});





