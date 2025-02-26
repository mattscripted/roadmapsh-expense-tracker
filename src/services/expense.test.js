const { getExpenses, getTotalExpenses } = require('./expense');
const Expense = require('../models/Expense');

jest.mock('../models/Expense', () => ({
  find: jest.fn()
}));

describe('getExpenses', () => {
  it('returns all expenses, when no filter is applied', () => {
    const mockExpenses = [
      {
        date: new Date('2025-02-25T00:00:00.000Z'),
        description: 'Lunch',
        amount: 20
      },
      {
        date: new Date('2025-02-25T00:00:00.000Z'),
        description: 'Dinner',
        amount: 35
      }
    ];
    Expense.find.mockReturnValueOnce(mockExpenses);

    expect(getExpenses()).toEqual(mockExpenses);
  });

  it('returns all expenses for a given month, when month filter is applied', () => {
    const januaryExpense1 = {
      date: new Date('2025-01-01T00:00:00.000Z'),
      description: 'Lunch',
      amount: 20
    };
    const januaryExpense2 = {
      date: new Date('2025-01-02T00:00:00.000Z'),
      description: 'Lunch 2',
      amount: 25
    };
    const februaryExpense = {
      date: new Date('2025-02-01T00:00:00.000Z'),
      description: 'Dinner',
      amount: 35
    }
    const mockExpenses = [
      januaryExpense1,
      januaryExpense2,
      februaryExpense,
    ];
    Expense.find.mockReturnValueOnce(mockExpenses);

    expect(getExpenses({ month: 1 })).toEqual([januaryExpense1, januaryExpense2]);
  });
});

describe('getTotalExpenses', () => {
  it('returns sum of all expenses, when no filter is applied', () => {
    const amount1 = 20;
    const amount2 = 35;
    const expectedTotal = amount1 + amount2;

    const mockExpenses = [
      {
        date: new Date('2025-01-01T00:00:00.000Z'),
        description: 'Lunch',
        amount: amount1
      },
      {
        date: new Date('2025-02-01T00:00:00.000Z'),
        description: 'Dinner',
        amount: amount2
      }
    ];
    Expense.find.mockReturnValueOnce(mockExpenses);

    expect(getTotalExpenses()).toEqual(expectedTotal);
  });

  it('returns sum of all expenses for a given month, when month filter is applied', () => {
    const januaryAmount1 = 20;
    const januaryAmount2 = 35;
    const expectedTotal = januaryAmount1 + januaryAmount2;

    const januaryExpense1 = {
      date: new Date('2025-01-01T00:00:00.000Z'),
      description: 'Lunch',
      amount: januaryAmount1,
    };
    const januaryExpense2 = {
      date: new Date('2025-01-02T00:00:00.000Z'),
      description: 'Lunch 2',
      amount: januaryAmount2,
    };
    const februaryExpense = {
      date: new Date('2025-02-01T00:00:00.000Z'),
      description: 'Dinner',
      amount: 35
    }
    const mockExpenses = [
      januaryExpense1,
      januaryExpense2,
      februaryExpense,
    ];
    Expense.find.mockReturnValueOnce(mockExpenses);

    expect(getTotalExpenses({ month: 1 })).toEqual(expectedTotal);
  });
})
