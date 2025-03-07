import * as React from 'react';
import { Check, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Command, CommandGroup, CommandItem } from './command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { Badge } from './badge';
import { Separator } from './separator';

export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 
  'greaterThan' | 'lessThan' | 'between' | 'in' | 'notIn' | 'isEmpty' | 'isNotEmpty';

export interface FilterOption<T = any> {
  id: string;
  label: string;
  value: T;
  operators?: FilterOperator[];
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FilterValue {
  field: string;
  operator: FilterOperator;
  value: any;
}

interface FilterProps {
  options: FilterOption[];
  value: FilterValue[];
  onChange: (value: FilterValue[]) => void;
  maxFilters?: number;
  className?: string;
}

export function Filter({
  options,
  value,
  onChange,
  maxFilters = Infinity,
  className,
}: FilterProps) {
  const [open, setOpen] = React.useState(false);

  const addFilter = React.useCallback(
    (option: FilterOption) => {
      if (value.length >= maxFilters) return;
      
      const defaultOperator = option.operators?.[0] || 'equals';
      onChange([
        ...value,
        { field: option.id, operator: defaultOperator, value: undefined },
      ]);
    },
    [value, onChange, maxFilters]
  );

  const removeFilter = React.useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const updateFilter = React.useCallback(
    (index: number, updates: Partial<FilterValue>) => {
      onChange(
        value.map((filter, i) =>
          i === index ? { ...filter, ...updates } : filter
        )
      );
    },
    [value, onChange]
  );

  const getOperatorLabel = (operator: FilterOperator): string => {
    switch (operator) {
      case 'equals': return 'equals';
      case 'contains': return 'contains';
      case 'startsWith': return 'starts with';
      case 'endsWith': return 'ends with';
      case 'greaterThan': return 'greater than';
      case 'lessThan': return 'less than';
      case 'between': return 'between';
      case 'in': return 'is in';
      case 'notIn': return 'is not in';
      case 'isEmpty': return 'is empty';
      case 'isNotEmpty': return 'is not empty';
      default: return operator;
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {value.map((filter, index) => {
          const option = options.find((opt) => opt.id === filter.field);
          if (!option) return null;

          return (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <span>{option.label}</span>
              <span className="text-muted-foreground">
                {getOperatorLabel(filter.operator)}
              </span>
              {filter.value && (
                <span className="font-medium">{filter.value}</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter(index)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          );
        })}
        {value.length < maxFilters && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-dashed"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = value.some(
                      (filter) => filter.field === option.id
                    );

                    return (
                      <CommandItem
                        key={option.id}
                        onSelect={() => {
                          if (!isSelected) {
                            addFilter(option);
                            setOpen(false);
                          }
                        }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {option.icon && (
                            <option.icon className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{option.label}</span>
                        </div>
                        {isSelected && <Check className="h-4 w-4" />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}

// Type-safe filter builder helpers
export function createFilterOption<T>(option: FilterOption<T>): FilterOption<T> {
  return option;
}

export function applyFilters<T>(
  data: T[],
  filters: FilterValue[],
  getFieldValue: (item: T, field: string) => any
): T[] {
  return data.filter((item) =>
    filters.every((filter) => {
      const value = getFieldValue(item, filter.field);

      switch (filter.operator) {
        case 'equals':
          return value === filter.value;
        case 'contains':
          return String(value)
            .toLowerCase()
            .includes(String(filter.value).toLowerCase());
        case 'startsWith':
          return String(value)
            .toLowerCase()
            .startsWith(String(filter.value).toLowerCase());
        case 'endsWith':
          return String(value)
            .toLowerCase()
            .endsWith(String(filter.value).toLowerCase());
        case 'greaterThan':
          return value > filter.value;
        case 'lessThan':
          return value < filter.value;
        case 'between':
          return (
            value >= filter.value[0] && value <= filter.value[1]
          );
        case 'in':
          return filter.value.includes(value);
        case 'notIn':
          return !filter.value.includes(value);
        case 'isEmpty':
          return !value;
        case 'isNotEmpty':
          return !!value;
        default:
          return true;
      }
    })
  );
}

interface FilterGroupProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

export function FilterGroup({ children, label, className }: FilterGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <div className="text-sm font-medium">{label}</div>}
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}