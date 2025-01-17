const service = require('./services/expense');

function addExpense(options) {
  try {
    const expense = service.createExpense(options);
    console.log('Created expense', expense)
  } catch (error) {
    console.log(error.message);
  }
}

function getExpense({ id }) {
  try {
    const expense = service.getExpense(id);
    console.log(`Get expense (id: ${id})`, expense);
  } catch (error) {
    console.log(error.message);
  }
}

function updateExpense({ id, ...changes }) {
  try {
    const expense = service.updateExpense(id, changes);
    console.log(`Updated expense (id: ${id})`, expense);
  } catch (error) {
    console.log(error.message);
  }
}

function deleteExpense({ id }) {
  try {
    service.deleteExpense(id);
    console.log(`Deleted expense (id: ${id})`);
  } catch (error) {
    console.log(error.message);
  }
}

function listExpenses() {
  const expenses = service.getExpenses();
  console.log(expenses);
}

function summarizeExpenses({ month }) {
  const expenses = service.getExpenses({ month });
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  console.log(`Total expenses: $${totalAmount}`);
}

module.exports = {
  addExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  listExpenses,
  summarizeExpenses,
};
