import { describe, expect, it } from 'vitest';
import { isValidUrl } from './url';

describe('isValidUrl', () => {
  it('returns true for valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
    expect(isValidUrl('example.com')).toBe(true);
  });

  it('returns false for invalid inputs', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('http://localhost')).toBe(false);
    expect(isValidUrl('localhost')).toBe(false);
  });
});

