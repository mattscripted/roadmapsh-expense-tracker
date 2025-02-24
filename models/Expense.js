const FileModel = require('./File');

const Expense = new FileModel('Expense', {
  date: { type: Date, default: () => new Date() },
  description: { type: String, default: '' },
  amount: {
    type: Number,
    default: 0,
    validate: {
      validator: value => value > 0,
      message: document => `${document.amount} must be a positive number`
    },
  },
});

module.exports = Expense;
