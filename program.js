const commander = require('commander');
const controller = require('./controllers/expense');

const program = new commander.Command();

function parseDate(str) {
  const date = new Date(str);

  if (isNaN(date.valueOf())) {
    throw new commander.InvalidArgumentError('Not a valid date.');
  }

  return date;
}

program
  .name('expense-tracker')
  .description('Add, update, delete, and view expenses');

program.command('add')
  .description('Add expense')
  .requiredOption('-d, --description <description>', 'description')
  .requiredOption('-a, --amount <amount>', 'amount', parseFloat)
  .option('--date <date>', 'date (yyyy-mm-dd)', parseDate)
  .action(controller.addExpense);

program.command('get')
  .description('Get expense')
  .requiredOption('--id <id>', 'id')
  .action(controller.getExpense);

program.command('update')
  .description('Update expense')
  .requiredOption('--id <id>', 'id', parseInt)
  .option('-d, --description <description>', 'description')
  .option('-a, --amount <amount>', 'amount', parseFloat)
  .option('--date <date>', 'date (yyyy-mm-dd)', parseDate)
  .action(controller.updateExpense);

program.command('delete')
  .description('Delete expense')
  .requiredOption('--id <id>', 'id')
  .action(controller.deleteExpense);

program.command('list')
  .description('List all expenses')
  .action(controller.listExpenses);

program.command('summary')
  .description('Get total sum of expenses')
  // TODO: What if we don't pass a valid number?
  .option('-m, --month <month>', 'month (1 - 12) of current year')
  .action(controller.summarizeExpenses);

module.exports = program;
