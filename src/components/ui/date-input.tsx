import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';

interface DateInputProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  popoverClassName?: string;
  calendarClassName?: string;
  format?: string;
  fromDate?: Date;
  toDate?: Date;
}

export function DateInput({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  error,
  className,
  popoverClassName,
  calendarClassName,
  format: dateFormat = 'PPP',
  fromDate,
  toDate,
}: DateInputProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            error && 'border-destructive',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn('w-auto p-0', popoverClassName)}
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => date && onChange(date)}
          disabled={(date) => {
            const outOfRange = 
              (fromDate && date < fromDate) || 
              (toDate && date > toDate);
            return outOfRange || false;
          }}
          initialFocus
          className={calendarClassName}
        />
      </PopoverContent>
    </Popover>
  );
}

// Helper function to format date to string
export function formatDate(
  date: Date | null | undefined,
  dateFormat = 'PPP'
): string {
  if (!date) return '';
  return format(date, dateFormat);
}

// Helper function to parse string to date
export function parseDate(
  dateString: string,
  defaultValue?: Date
): Date | undefined {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? defaultValue : date;
}

interface DateRangeInputProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  error?: boolean;
  className?: string;
  disabled?: boolean;
}

export function DateRangeInput({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  error,
  className,
  disabled,
}: DateRangeInputProps) {
  return (
    <div className="flex items-center space-x-2">
      <DateInput
        value={startDate}
        onChange={onStartDateChange}
        error={error}
        className={className}
        placeholder="Start date"
        disabled={disabled}
      />
      <span className="text-muted-foreground">to</span>
      <DateInput
        value={endDate}
        onChange={onEndDateChange}
        error={error}
        className={className}
        placeholder="End date"
        disabled={disabled || !startDate}
      />
    </div>
  );
}