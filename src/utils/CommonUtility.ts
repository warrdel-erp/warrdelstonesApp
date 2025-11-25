const strToCamelCase = (str?: string): string => {
  return (
    str
      ?.replace(/^\w|[A-Z]|\b\w/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase(),
      )
      ?.replace(/\s+/g, '') ?? ''
  );
};

const capitalizeWords = (str?: string): string => {
  return (
    str
      ?.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') ?? ''
  );
};

const createShortForm = (str?: string): string => {
  if (!str) return '';
  return (
    str
      ?.trim()
      .split(/\s+/)
      .map(word => word.slice(0, 2))
      .join('')
      .toLowerCase() ?? ''
  );
};

const formatCurrency = (
  amount: number | string,
  abbreviated: boolean = false,
  currency: string = '$',
  locale: string = 'en-IN',
  options?: Partial<Intl.NumberFormatOptions>,
): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return `${currency}0.00`;
  }

  if (abbreviated) {
    const abbreviatedAmount = abbreviateNumber(numericAmount);
    return `${currency}${abbreviatedAmount}`;
  }

  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency === '₹' ? 'INR' : 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  };

  try {
    return new Intl.NumberFormat(locale, defaultOptions).format(numericAmount);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    const formatted = numericAmount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency}${formatted}`;
  }
};

const abbreviateNumber = (num: number): string => {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e9) {
    return sign + (absNum / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (absNum >= 1e6) {
    return sign + (absNum / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (absNum >= 1e3) {
    return sign + (absNum / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return sign + absNum.toString();
};

export { strToCamelCase, capitalizeWords, createShortForm, formatCurrency };

// Generic function to create an object updater
export const createObjectUpdater = <T extends Record<string, any>>(
  setState: React.Dispatch<React.SetStateAction<T>>,
) => {
  return (field: keyof T, value: T[keyof T]) => {
    setState(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };
};

// Alternative: Direct function that takes setState and field/value
export const updateObjectField = <T extends Record<string, any>>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  field: keyof T,
  value: T[keyof T],
) => {
  setState(prevData => ({
    ...prevData,
    [field]: value,
  }));
};

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
