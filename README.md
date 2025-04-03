# roadmapsh-expense-tracker
https://roadmap.sh/projects/expense-tracker

## Setup
To use `expense-tracker`:
- Install [nvm](https://github.com/nvm-sh/nvm)
- `nvm install node`
- You may need to run to `chmod +x index.js` from the `/src` folder
- `npm link` from the the root folder

## Commands
```sh
# Create an expense (returns an id)
expense-tracker add --description Dinner --amount 25

# Get an expense by id
expense-tracker get --id 1

# Update an expense by id
expense-tracker update --id 1 --description Lunch
expense-tracker update --id 1 --amount 15
expense-tracker update --id 1 --description Lunch --amount 15

# Delete an expense by id
expense-tracker delete --id 1

# List all expenses
expense-tracker list

# Get a summary of expenses (total spent)
expense-tracker summary
# Get a summary of expenses for a given month (across all years)
expense-tracker summary --month 1
```

## `FileModel`
This project includes a Mongoose-inspired `FileModel` to define a model schema, validate props against the schema, and provide methods to manipulate models. The data is stored in a file as JSON.

To define the schema:
```js
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
```

To manipulate models:
```js
Expense.create(props);
Expense.find();
Expense.findById(id);
Expense.updateById(id, changes);
Expense.deleteById(id);
```
