const service = require('./service');

function addExpense(options) {
  const { description, amount } = options;
  service.createExpense({ description, amount });
}

function updateExpense(options) {
  const { id, ...changes } = options;
  service.updateExpense(id, changes);
}

function deleteExpense(options) {
  const { id } = options;
  service.deleteExpense(id);
}

function listExpenses() {
  console.log('listExpenses (controller)');
  service.getExpenses();
}

function summarizeExpenses(options) {
  console.log('summarizeExpenses (controller)', options);
  const { month } = options;
  service.getExpenses({ month });
}

module.exports = {
  addExpense,
  updateExpense,
  deleteExpense,
  listExpenses,
  summarizeExpenses,
};
