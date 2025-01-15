#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .name('expense-tracker')
  .description('Add, update, delete, and view expenses');

program.command('add')
  .description('Add expense')
  .requiredOption('-d, --description <description>', 'description')
  .requiredOption('-a, --amount <amount>', 'amount')
  .action((options) => {
    console.log('add', options)
  });

program.command('update')
  .description('Update expense')
  .requiredOption('--id <id>', 'id')
  .option('-d, --description <description>', 'description')
  .option('-a, --amount <amount>', 'amount')
  .action((options) => {
    console.log('update', options)
  });

program.command('delete')
  .description('Delete expense')
  .requiredOption('--id <id>', 'id')
  .action((options) => {
    console.log('delete', options)
  });

program.command('list')
  .description('List all expenses')
  .action(() => {
    console.log('list');
  });

program.command('summary')
  .description('Get total sum of expenses')
  // TODO: What if we don't pass a valid number?
  .option('-m, --month <month>', 'month (1 - 12) of current year')
  .action((options) => {
    console.log('summary', options)
  });

program.parse();
