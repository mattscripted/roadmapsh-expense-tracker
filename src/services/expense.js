const Expense = require('../models/Expense');

function createExpense(props) {
  return Expense.create(props);
}

function getExpense(id) {
  return Expense.findById(id);
}

function updateExpense(id, changes) {
  return Expense.updateById(id, changes);
}

function deleteExpense(id) {
  return Expense.deleteById(id);
}

function getExpenses({ month } = {}) {
  const expenses = Expense.find();

  if (month) {
    // Date.getMonth() is 0 - 11, but we use 1 - 12
    // TODO: Let FileModel convert date string to Date
    return expenses.filter(expense => new Date(expense.date).getUTCMonth() === month - 1);
  }

  return expenses;
}

function getTotalExpenses({ month } = {}) {
  const expenses = getExpenses({ month });
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

module.exports = {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
  getTotalExpenses
};
