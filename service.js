function createExpense({ description, amount }) {
  console.log('createExpense (service)', { description, amount });
}

function updateExpense(id, changes) {
  console.log('updateExpense (service)', id, changes);
}

function deleteExpense(id) {
  console.log('deleteExpense (service)', id);
}

function getExpenses(filter) {
  console.log('getExpenses (service)', filter);
}

module.exports = { createExpense, updateExpense, deleteExpense, getExpenses };
