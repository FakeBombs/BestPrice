
/**
 * Format a price value with currency symbol
 */
export const formatPrice = (price: number, currencySymbol: string = '$'): string => {
  return `${currencySymbol}${price.toFixed(2)}`;
};

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
