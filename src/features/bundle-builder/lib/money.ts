/** Format a number as USD, always with two decimals: 27.98 -> "$27.98". */
export const formatUSD = (value: number): string => `$${value.toFixed(2)}`;
