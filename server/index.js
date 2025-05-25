require('dotenv').config(); // Load variables from .env
 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authenticateToken = require('./middleware/authMiddleware');
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // only if you're using cookies or Authorization headers
}));
 
app.use(express.json());
 
// ✅ Connect auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
 
 
 
// MongoDB connection with IPv4 and logging
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
 
// ✅ Define Expense schema and model (with userId)
const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  date: Date,
  category: String,
  amount: Number,
  title: String,
  message: String,
});
 
const Expense = mongoose.model('Expense', ExpenseSchema);
 
// ✅ Define Income schema and model (with userId)
const IncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  date: Date,
  category: String,
  amount: Number,
  title: String,
  message: String,
});
 
const Income = mongoose.model('Income', IncomeSchema);
 
// ✅ Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});
 
// ✅ Route to fetch all expenses & incomes for a user (protected)
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
 
    const expenses = await Expense.find({ userId }).lean();
    const incomes = await Income.find({ userId }).lean();
 
    const combined = [
      ...expenses.map(e => ({ ...e, type: 'expense' })),
      ...incomes.map(i => ({ ...i, type: 'income' })),
    ];
 
    // Sort by date, newest first
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));
 
    res.json(combined);
  } catch (err) {
    console.error('❌ Error fetching records:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});
 
// ✅ Route to add a new expense (protected)
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
 
// ✅ Route to add a new income (protected)
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
 
// DELETE an expense by ID (protected)
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user.userId;
 
    // Delete only if the expense belongs to the logged-in user
    const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId, userId });
 
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }
 
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting expense:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
 
 
// ✅ Start server after DB is ready
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log("🚀 Server running on port ${PORT}");
  });
});