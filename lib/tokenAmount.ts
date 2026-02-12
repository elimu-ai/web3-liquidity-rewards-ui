import { ethers } from 'ethers'

function addThousandsSeparators(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Formats a token amount using truncation (round down), never rounding up.
 */
export function formatTokenAmountDownFromWei(
  amountWei: bigint,
  tokenDecimals = 18,
  displayDecimals = 2
): string {
  if (amountWei < 0n) {
    return '0.00'
  }

  const base = 10n ** BigInt(tokenDecimals)
  const scale = 10n ** BigInt(displayDecimals)
  const whole = amountWei / base
  const fraction = ((amountWei % base) * scale) / base

  const wholeStr = addThousandsSeparators(whole.toString())
  const fractionStr = fraction.toString().padStart(displayDecimals, '0')
  return `${wholeStr}.${fractionStr}`
}

/**
 * Parses a user-entered token amount into wei. Returns null for invalid inputs.
 */
export function parseTokenInputToWei(value: string, tokenDecimals = 18): bigint | null {
  const trimmed = value.trim()
  if (trimmed === '') {
    return 0n
  }

  if (!/^\d*\.?\d*$/.test(trimmed)) {
    return null
  }

  try {
    return BigInt(ethers.utils.parseUnits(trimmed, tokenDecimals).toString())
  } catch {
    return null
  }
}
