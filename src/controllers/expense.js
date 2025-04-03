const expenseService = require('../services/expense');

const EXPENSE_TABLE_COLUMNS = ['id', 'date', 'description', 'amount'];

function addExpense(options) {
  try {
    const expense = expenseService.createExpense(options);
    console.log('Successfully created expense:')
    console.table([expense], EXPENSE_TABLE_COLUMNS);
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

    console.table([expense], EXPENSE_TABLE_COLUMNS);
  } catch (error) {
    console.log(error.message);
  }
}

function updateExpense({ id, ...updates }) {
  try {
    const expense = expenseService.updateExpense(id, updates);
    console.log('Successfully updated expense:');
    console.table([expense], EXPENSE_TABLE_COLUMNS);
    
  } catch (error) {
    console.log(error.message);
  }
}

function deleteExpense({ id }) {
  try {
    expenseService.deleteExpense(id);
    console.log(`Successfully deleted expense (id: ${id})`);
  } catch (error) {
    console.log(error.message);
  }
}

function listExpenses() {
  const expenses = expenseService.getExpenses();
  console.table(expenses);
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
