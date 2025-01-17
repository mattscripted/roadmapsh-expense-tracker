const FileModel = require('./File');

const Expense = new FileModel('Expense', {
  date: new Intl.DateTimeFormat('en-CA').format(new Date()),
  description: '',
  amount: 0,
});

module.exports = Expense;
