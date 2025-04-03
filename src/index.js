#!/usr/bin/env node

const { Command } = require('commander');
const controller = require('./controllers/expense');
const { parseAmount, parseDate, parseMonth } = require('./utils/parse-args');

const program = new Command();

program
  .name('expense-tracker')
  .description('Add, update, delete, and view expenses');

program.command('add')
  .description('Add expense')
  .requiredOption('-d, --description <description>', 'description')
  .requiredOption('-a, --amount <amount>', 'amount', parseAmount)
  .option('--date <date>', 'date (yyyy-mm-dd)', parseDate)
  .action(controller.addExpense);

program.command('get')
  .description('Get expense')
  .requiredOption('--id <id>', 'id', parseInt)
  .action(controller.getExpense);

program.command('update')
  .description('Update expense')
  .requiredOption('--id <id>', 'id', parseInt)
  .option('-d, --description <description>', 'description')
  .option('-a, --amount <amount>', 'amount', parseAmount)
  .option('--date <date>', 'date (yyyy-mm-dd)', parseDate)
  .action(controller.updateExpense);

program.command('delete')
  .description('Delete expense')
  .requiredOption('--id <id>', 'id', parseInt)
  .action(controller.deleteExpense);

program.command('list')
  .description('List all expenses')
  .action(controller.listExpenses);

program.command('summary')
  .description('Get total sum of expenses')
  .option('-m, --month <month>', 'month (1 - 12) of current year', parseMonth)
  .action(controller.summarizeExpenses);

program.parse();
