const expenseService = require('../services/expense');

function addExpense(options) {
  try {
    const expense = expenseService.createExpense(options);
    console.log('Created expense', expense)
  } catch (error) {
    console.log(error.message);
  }
}

function getExpense({ id }) {
  try {
    const expense = expenseService.getExpense(id);

    if (!expense) {
      throw new Error(`Expense not found (id: ${id})`);
    }
    console.log(`Get expense (id: ${id})`, expense);
  } catch (error) {
    console.log(error.message);
  }
}

function updateExpense({ id, ...updates }) {
  try {
    const expense = expenseService.updateExpense(id, updates);
    console.log(`Updated expense (id: ${id})`, expense);
  } catch (error) {
    console.log(error.message);
  }
}

function deleteExpense({ id }) {
  try {
    expenseService.deleteExpense(id);
    console.log(`Deleted expense (id: ${id})`);
  } catch (error) {
    console.log(error.message);
  }
}

function listExpenses() {
  const expenses = expenseService.getExpenses();
  console.log(expenses);
}

function summarizeExpenses({ month }) {
  const totalExpenses = expenseService.getTotalExpenses({ month });
  console.log(`Total expenses: $${totalExpenses}`);
}

module.exports = {
  addExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  listExpenses,
  summarizeExpenses,
};
