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
    console.log(`Get expense (id: ${id})`, expense);
  } catch (error) {
    console.log(error.message);
  }
}

function updateExpense({ id, ...changes }) {
  try {
    const expense = expenseService.updateExpense(id, changes);
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
