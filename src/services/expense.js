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

// TODO: Support filtering by month
function getExpenses(filter) {
  const expenses = Expense.find();

  if (filter) {
    // Currently, we only support filtering by month
    // getMonth() is 0 - 11, but filter.month is 1 - 12
    // TODO: getMonth isn't working?
    return expenses.filter(expense => {
      console.log('getExpenses', expense, expense.date, typeof expense.date)
      return expense.date.getMonth() === filter.month - 1
    });
  }

  return expenses;
}

module.exports = { createExpense, getExpense, updateExpense, deleteExpense, getExpenses };
