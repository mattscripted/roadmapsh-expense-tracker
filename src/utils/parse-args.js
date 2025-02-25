const commander = require('commander');

function parseAmount(value) {
  const amount = parseFloat(value);

  if (isNaN(amount) || value <= 0) {
    throw new commander.InvalidArgumentError('Amount must be positive.');
  }

  return amount;
}

function parseDate(value) {
  const date = new Date(value);

  if (isNaN(date.valueOf())) {
    throw new commander.InvalidArgumentError('Not a valid date.');
  }

  return date;
}

function parseMonth(value) {
  const month = parseInt(value);

  if (isNaN(month) || month < 1 || month > 12) {
    throw new commander.InvalidArgumentError('Month must be a number between 1 and 12.');
  }

  return month;
}

module.exports = {
  parseAmount,
  parseDate,
  parseMonth,
}
