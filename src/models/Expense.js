const FileModel = require('../lib/FileModel');

const Expense = new FileModel('Expense', {
  date: {
    type: Date,
    default: () => new Date(),
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: value => value > 0,
      message: 'must be a positive number',
    },
  },
});

module.exports = Expense;
