import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';
import { Badge } from './badge';
import { Command, CommandGroup, CommandItem } from './command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { cn } from '@/lib/utils';

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  maxSelected?: number;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options',
  className,
  disabled,
  error,
  maxSelected = Infinity,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const handleUnselect = React.useCallback(
    (value: string) => {
      onChange(selected.filter((item) => item !== value));
    },
    [selected, onChange]
  );

  const handleSelect = React.useCallback(
    (value: string) => {
      if (selected.includes(value)) {
        handleUnselect(value);
      } else if (selected.length < maxSelected) {
        onChange([...selected, value]);
      }
    },
    [selected, onChange, handleUnselect, maxSelected]
  );

  const filteredOptions = React.useMemo(() => {
    return options.filter((option) => {
      const matchesQuery = option.label
        .toLowerCase()
        .includes(query.toLowerCase());
      const isSelectable = !option.disabled;
      return matchesQuery && isSelectable;
    });
  }, [options, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            'min-h-[2.5rem] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background',
            disabled && 'cursor-not-allowed opacity-50',
            error && 'border-destructive',
            className
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selected.map((value) => {
              const option = options.find((opt) => opt.value === value);
              if (!option) return null;

              return (
                <Badge
                  key={value}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {option.icon && (
                    <option.icon className="h-3 w-3 text-muted-foreground" />
                  )}
                  {option.label}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(value)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            {selected.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command
          filter={(value, search) => {
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <div className="flex items-center border-b px-3">
            <CommandPrimitive.Input
              placeholder="Search..."
              value={query}
              onValueChange={setQuery}
              className="h-9 w-full bg-transparent py-3 outline-none placeholder:text-muted-foreground"
            />
          </div>
          <CommandGroup className="max-h-64 overflow-auto p-1">
            {filteredOptions.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <CheckIcon className={cn('h-4 w-4')} />
                  </div>
                  <div className="flex items-center gap-2">
                    {option.icon && (
                      <option.icon className="h-4 w-4 text-muted-foreground" />
                    )}
                    {option.label}
                  </div>
                </CommandItem>
              );
            })}
            {filteredOptions.length === 0 && (
              <p className="p-2 text-center text-sm text-muted-foreground">
                No options found.
              </p>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}