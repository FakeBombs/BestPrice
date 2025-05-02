
/**
 * Format price to a readable string with currency
 * 
 * @param price - The price to format
 * @param currency - The currency symbol (default: '€')
 * @param locale - The locale to use for number formatting (default: 'el-GR')
 */
export const formatPrice = (price: number, currency = '€', locale = 'el-GR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Format a date to a readable string
 * 
 * @param date - Date to format
 * @param locale - Locale to use for date formatting
 */
export const formatDate = (date: string | Date, locale = 'el-GR'): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a number as a percentage
 * 
 * @param value - The value to format as percentage
 * @param locale - The locale to use
 */
export const formatPercentage = (value: number, locale = 'el-GR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value / 100);
};

/**
 * Truncate text if it's too long
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 */
export const truncateText = (text: string, maxLength = 100): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength)}...`;
};
