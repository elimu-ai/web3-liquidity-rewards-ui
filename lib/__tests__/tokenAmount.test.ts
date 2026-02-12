import { describe, expect, it } from 'vitest'
import { formatTokenAmountDownFromWei, parseTokenInputToWei } from '../tokenAmount'

describe('formatTokenAmountDownFromWei', () => {
  it('formats zero correctly with default decimals', () => {
    expect(formatTokenAmountDownFromWei(BigInt(0))).toBe('0.00')
  })

  it('formats zero correctly with custom display decimals', () => {
    expect(formatTokenAmountDownFromWei(BigInt(0), 18, 4)).toBe('0.0000')
    expect(formatTokenAmountDownFromWei(BigInt(0), 18, 6)).toBe('0.000000')
    expect(formatTokenAmountDownFromWei(BigInt(0), 18, 1)).toBe('0.0')
  })

  it('formats negative values as zero', () => {
    expect(formatTokenAmountDownFromWei(BigInt(-1))).toBe('0.00')
    expect(formatTokenAmountDownFromWei(BigInt(-1000), 18, 4)).toBe('0.0000')
  })

  it('formats whole number tokens correctly', () => {
    // 1 token with 18 decimals
    expect(formatTokenAmountDownFromWei(BigInt('1000000000000000000'))).toBe('1.00')
    // 100 tokens with 18 decimals
    expect(formatTokenAmountDownFromWei(BigInt('100000000000000000000'))).toBe('100.00')
  })

  it('formats tokens with fractions correctly', () => {
    // 1.5 tokens (1.5 * 10^18)
    expect(formatTokenAmountDownFromWei(BigInt('1500000000000000000'))).toBe('1.50')
    // 0.123 tokens
    expect(formatTokenAmountDownFromWei(BigInt('123000000000000000'))).toBe('0.12')
  })

  it('truncates (rounds down) instead of rounding up', () => {
    // 53.638 tokens - should truncate to 53.63, not round to 53.64
    expect(formatTokenAmountDownFromWei(BigInt('53638000000000000000'))).toBe('53.63')
    // 99.999 tokens - should truncate to 99.99, not round to 100.00
    expect(formatTokenAmountDownFromWei(BigInt('99999000000000000000'))).toBe('99.99')
  })

  it('adds thousands separators', () => {
    // 1,234.56 tokens
    expect(formatTokenAmountDownFromWei(BigInt('1234560000000000000000'))).toBe('1,234.56')
    // 1,000,000.00 tokens
    expect(formatTokenAmountDownFromWei(BigInt('1000000000000000000000000'))).toBe('1,000,000.00')
    // 12,345,678.90 tokens
    expect(formatTokenAmountDownFromWei(BigInt('12345678900000000000000000'))).toBe('12,345,678.90')
  })

  it('handles different token decimals', () => {
    // USDC with 6 decimals: 1.5 USDC
    expect(formatTokenAmountDownFromWei(BigInt('1500000'), 6, 2)).toBe('1.50')
    // WBTC with 8 decimals: 0.1 BTC
    expect(formatTokenAmountDownFromWei(BigInt('10000000'), 8, 2)).toBe('0.10')
  })

  it('handles different display decimals', () => {
    const amount = BigInt('1234567890000000000') // 1.23456789 tokens
    expect(formatTokenAmountDownFromWei(amount, 18, 2)).toBe('1.23')
    expect(formatTokenAmountDownFromWei(amount, 18, 4)).toBe('1.2345')
    expect(formatTokenAmountDownFromWei(amount, 18, 6)).toBe('1.234567')
    expect(formatTokenAmountDownFromWei(amount, 18, 8)).toBe('1.23456789')
  })

  it('handles very large amounts', () => {
    // Max uint256 value
    const maxUint256 = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935')
    const formatted = formatTokenAmountDownFromWei(maxUint256)
    expect(formatted).toMatch(/^[\d,]+\.\d{2}$/)
    expect(formatted.includes(',')).toBe(true)
  })

  it('handles dust amounts (very small values)', () => {
    // 0.000000000000000001 tokens (1 wei)
    expect(formatTokenAmountDownFromWei(BigInt(1))).toBe('0.00')
    // Very small but not zero
    expect(formatTokenAmountDownFromWei(BigInt('10000000000000000'))).toBe('0.01')
  })
})

describe('parseTokenInputToWei', () => {
  it('parses empty string as zero', () => {
    expect(parseTokenInputToWei('')).toBe(0n)
    expect(parseTokenInputToWei('   ')).toBe(0n)
  })

  it('parses whole numbers correctly', () => {
    expect(parseTokenInputToWei('1')).toBe(BigInt('1000000000000000000'))
    expect(parseTokenInputToWei('10')).toBe(BigInt('10000000000000000000'))
    expect(parseTokenInputToWei('100')).toBe(BigInt('100000000000000000000'))
  })

  it('parses decimal numbers correctly', () => {
    expect(parseTokenInputToWei('1.5')).toBe(BigInt('1500000000000000000'))
    expect(parseTokenInputToWei('0.1')).toBe(BigInt('100000000000000000'))
    expect(parseTokenInputToWei('0.01')).toBe(BigInt('10000000000000000'))
  })

  it('handles leading and trailing whitespace', () => {
    expect(parseTokenInputToWei('  1.5  ')).toBe(BigInt('1500000000000000000'))
    expect(parseTokenInputToWei('\t10\n')).toBe(BigInt('10000000000000000000'))
  })

  it('handles numbers with many decimal places', () => {
    // 18 decimal places (full precision)
    expect(parseTokenInputToWei('1.123456789012345678')).toBe(BigInt('1123456789012345678'))
    // More than 18 decimals - ethers.parseUnits will throw, so should return null
    expect(parseTokenInputToWei('1.1234567890123456789')).toBeNull()
  })

  it('handles different token decimals', () => {
    // USDC with 6 decimals
    expect(parseTokenInputToWei('1.5', 6)).toBe(BigInt('1500000'))
    expect(parseTokenInputToWei('100', 6)).toBe(BigInt('100000000'))
    
    // WBTC with 8 decimals
    expect(parseTokenInputToWei('0.1', 8)).toBe(BigInt('10000000'))
  })

  it('rejects invalid formats', () => {
    expect(parseTokenInputToWei('abc')).toBeNull()
    expect(parseTokenInputToWei('1.2.3')).toBeNull()
    expect(parseTokenInputToWei('1e5')).toBeNull()
    expect(parseTokenInputToWei('1,000')).toBeNull()
    expect(parseTokenInputToWei('-1')).toBeNull()
    expect(parseTokenInputToWei('+1')).toBeNull()
    expect(parseTokenInputToWei('1$')).toBeNull()
    expect(parseTokenInputToWei('$1')).toBeNull()
  })

  it('accepts valid decimal formats', () => {
    expect(parseTokenInputToWei('0')).toBe(0n)
    expect(parseTokenInputToWei('0.0')).toBe(0n)
    expect(parseTokenInputToWei('.5')).toBe(BigInt('500000000000000000'))
    expect(parseTokenInputToWei('5.')).toBe(BigInt('5000000000000000000'))
    expect(parseTokenInputToWei('123.456')).toBe(BigInt('123456000000000000000'))
  })

  it('handles very large numbers', () => {
    const largeNumber = '1234567890123456789.0'
    const result = parseTokenInputToWei(largeNumber)
    expect(result).not.toBeNull()
    expect(result).toBe(BigInt('1234567890123456789000000000000000000'))
  })

  it('handles very large numbers without overflow', () => {
    // BigInt can handle very large numbers that would overflow Number
    const veryLarge = '1'.repeat(50) + '.0'
    const result = parseTokenInputToWei(veryLarge)
    expect(result).not.toBeNull()
    expect(typeof result).toBe('bigint')
  })

  it('handles edge case: single decimal point', () => {
    // Single dot is not a valid number format
    expect(parseTokenInputToWei('.')).toBeNull()
  })

  it('handles edge case: leading zeros', () => {
    expect(parseTokenInputToWei('001')).toBe(BigInt('1000000000000000000'))
    expect(parseTokenInputToWei('0.001')).toBe(BigInt('1000000000000000'))
  })

  it('maintains precision for common use cases', () => {
    // Staking 100 tokens
    expect(parseTokenInputToWei('100')).toBe(BigInt('100000000000000000000'))
    // Staking 0.5 tokens
    expect(parseTokenInputToWei('0.5')).toBe(BigInt('500000000000000000'))
    // Small amount: 0.001 tokens
    expect(parseTokenInputToWei('0.001')).toBe(BigInt('1000000000000000'))
  })
})

describe('formatTokenAmountDownFromWei and parseTokenInputToWei round-trip', () => {
  it('should be consistent for round-trip conversions', () => {
    const testCases = ['1', '10', '100.5', '0.12', '1234.56']
    
    testCases.forEach((input) => {
      const wei = parseTokenInputToWei(input)
      expect(wei).not.toBeNull()
      const formatted = formatTokenAmountDownFromWei(wei!)
      // Parse the formatted value back (removing commas)
      const roundTrip = parseTokenInputToWei(formatted.replace(/,/g, ''))
      // Should match because we're using values that fit in 2 decimal places
      expect(roundTrip).toBe(wei)
    })
  })

  it('should handle truncation correctly in round-trip', () => {
    // Original: 1.23456789
    const original = '1.23456789'
    const wei = parseTokenInputToWei(original)
    // Format with 2 decimals (truncates to 1.23)
    const formatted = formatTokenAmountDownFromWei(wei!, 18, 2)
    expect(formatted).toBe('1.23')
    // Parse back - should be less than original
    const roundTrip = parseTokenInputToWei(formatted)
    expect(roundTrip).toBeLessThan(wei!)
  })
})
