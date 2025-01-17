const FileModel = require('./file-model');

const Expense = new FileModel('Expense', {
  date: new Intl.DateTimeFormat('en-CA').format(new Date()),
  description: '',
  amount: 0,
});

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
  return Expense.find();
}

module.exports = { createExpense, getExpense, updateExpense, deleteExpense, getExpenses };
