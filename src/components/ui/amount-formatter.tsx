import React from 'react';
import { cn } from '@/lib/utils';

interface AmountFormatterProps {
  amount: number;
  currency?: string;
  locale?: string;
  showSign?: boolean;
  colorize?: boolean;
  className?: string;
}

export function AmountFormatter({
  amount,
  currency = 'EUR',
  locale = 'de-DE',
  showSign = false,
  colorize = false,
  className
}: AmountFormatterProps) {
  const formattedAmount = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    signDisplay: showSign ? 'always' : 'auto'
  }).format(amount);

  return (
    <span
      className={cn(
        'tabular-nums',
        colorize && amount > 0 && 'text-green-500 dark:text-green-400',
        colorize && amount < 0 && 'text-red-500 dark:text-red-400',
        className
      )}
    >
      {formattedAmount}
    </span>
  );
}

interface AmountDeltaProps extends AmountFormatterProps {
  previousAmount: number;
}

export function AmountDelta({
  amount,
  previousAmount,
  ...props
}: AmountDeltaProps) {
  const delta = amount - previousAmount;
  const percentageChange = previousAmount !== 0
    ? ((delta / Math.abs(previousAmount)) * 100)
    : 0;

  return (
    <div className="flex flex-col">
      <AmountFormatter amount={delta} showSign colorize {...props} />
      <span
        className={cn(
          'text-xs',
          delta > 0 && 'text-green-500 dark:text-green-400',
          delta < 0 && 'text-red-500 dark:text-red-400'
        )}
      >
        {percentageChange.toFixed(2)}%
      </span>
    </div>
  );
}