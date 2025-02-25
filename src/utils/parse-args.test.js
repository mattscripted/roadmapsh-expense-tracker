const { parseAmount, parseDate, parseMonth } = require('./parse-args');

describe('parseAmount', () => {
  it('parses valid amounts', () => {
    expect(parseAmount(0.01)).toBe(0.01);
    expect(parseAmount('0.01')).toBe(0.01);
  });

  it('throws an error for invalid amounts', () => {
    expect(() => parseAmount(0)).toThrow();
    expect(() => parseAmount('0')).toThrow();
    expect(() => parseAmount(-0.01)).toThrow();
    expect(() => parseAmount('-0.01')).toThrow();
    expect(() => parseAmount('not-a-number')).toThrow();
  });
});

describe('parseDate', () => {
  it('parses valid dates', () => {
    expect(parseDate('2025-01-01')).toEqual(new Date('2025-01-01'));
    expect(parseDate('2025-12-31')).toEqual(new Date('2025-12-31'));
  });

  it('throws an error for invalid dates', () => {
    expect(() => parseDate('2025-00-01')).toThrow();
    expect(() => parseDate('2025-01-00')).toThrow();
    expect(() => parseDate('2025-01-32')).toThrow();
    expect(() => parseDate('2025-12-00')).toThrow();
    expect(() => parseDate('2025-12-32')).toThrow();
    expect(() => parseDate('not-a-date')).toThrow();
  });
});

describe('parseMonth', () => {
  it('parses valid months', () => {
    expect(parseMonth(1)).toBe(1);
    expect(parseMonth('1')).toBe(1);
    expect(parseMonth(12)).toBe(12);
    expect(parseMonth('12')).toBe(12);
  });

  it('throws an error for invalid months', () => {
    expect(() => parseMonth(0)).toThrow();
    expect(() => parseMonth('0')).toThrow();
    expect(() => parseMonth(13)).toThrow();
    expect(() => parseMonth('13')).toThrow();
    expect(() => parseMonth('not-a-number')).toThrow();
  });
});