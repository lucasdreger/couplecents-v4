import * as React from 'react';
import { Input } from './input';
import { cn, formatCurrency } from '@/lib/utils';

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  locale?: string;
  error?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  currency = 'USD',
  locale = 'en-US',
  error,
  className,
  ...props
}: CurrencyInputProps) {
  // Convert number to localized string without currency symbol
  const formatValue = (num: number) => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Convert localized string to number
  const parseValue = (str: string) => {
    const cleanStr = str.replace(/[^0-9.-]/g, '');
    return cleanStr ? Number(cleanStr) : 0;
  };

  const [displayValue, setDisplayValue] = React.useState(() => 
    formatValue(value)
  );

  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatValue(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    const numericValue = parseValue(newValue);
    if (!isNaN(numericValue)) {
      onChange(numericValue / 100); // Convert cents to dollars
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
    setDisplayValue(formatValue(value));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
    setDisplayValue(formatValue(value));
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3',
          error && 'text-destructive'
        )}
      >
        {new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
        })
          .format(0)
          .replace(/[\d.,]/g, '')
          .trim()}
      </div>
      <Input
        {...props}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={cn('pl-8', error && 'border-destructive', className)}
      />
    </div>
  );
}

export function formatCurrencyValue(
  value: number,
  currency = 'USD',
  locale = 'en-US'
) {
  return formatCurrency(value, { currency, locale });
}