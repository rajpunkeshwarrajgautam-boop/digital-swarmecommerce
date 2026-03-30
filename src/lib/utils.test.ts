import { describe, it, expect } from 'vitest';
import { formatCurrency, cn, convertAmount } from './utils';

describe('Utility Protocols', () => {
  describe('formatCurrency (Formatting Only)', () => {
    it('should format INR by default', () => {
      expect(formatCurrency(100)).toBe('₹100');
    });

    it('should format USD accurately without auto-conversion', () => {
      expect(formatCurrency(100, 'USD')).toBe('$100.00');
    });
  });

  describe('convertAmount (Logic)', () => {
    it('should convert INR to USD correctly', () => {
      const amount = 100; // INR
      expect(convertAmount(amount, 'USD')).toBe(1.2);
    });
  });

  describe('cn (Tailwind Merge)', () => {
    it('should merge tailwind classes effectively', () => {
      const result = cn('px-2 py-2', 'px-4');
      expect(result).toBe('py-2 px-4');
    });
  });
});
