const FileModel = require('./File');

const Expense = new FileModel('Expense', {
  date: {
    type: Date,
    default: () => new Date(),
    required: true,
  },
  description: {
    type: String,
    default: '',
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
    required: true,
    validate: {
      validator: value => value > 0,
      message: document => `${document.amount} must be a positive number`
    },
  },
});

module.exports = Expense;
