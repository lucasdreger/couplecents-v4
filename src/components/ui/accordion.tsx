import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  collapsible?: boolean;
  className?: string;
  iconClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function Accordion({
  items,
  type = 'single',
  defaultValue,
  collapsible = true,
  className,
  iconClassName,
  headerClassName,
  contentClassName,
}: AccordionProps) {
  const [value, setValue] = React.useState<string | string[]>(
    defaultValue || (type === 'multiple' ? [] : '')
  );

  const handleValueChange = (newValue: string) => {
    if (type === 'multiple') {
      setValue((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const index = prevArray.indexOf(newValue);
        if (index === -1) {
          return [...prevArray, newValue];
        }
        return prevArray.filter((v) => v !== newValue);
      });
    } else {
      setValue(newValue === value ? '' : newValue);
    }
  };

  return (
    <AccordionPrimitive.Root
      type={type}
      value={value}
      onValueChange={handleValueChange}
      collapsible={collapsible}
      className={cn('w-full space-y-1', className)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          disabled={item.disabled}
          className="border-b"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              className={cn(
                'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
                item.disabled && 'cursor-not-allowed opacity-50',
                headerClassName
              )}
            >
              <div className="flex items-center gap-2">
                {item.icon && (
                  <item.icon
                    className={cn(
                      'h-4 w-4 text-muted-foreground',
                      iconClassName
                    )}
                  />
                )}
                {item.title}
              </div>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content
            className={cn(
              'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
              contentClassName
            )}
          >
            <div className="pb-4 pt-0">{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

// Type-safe accordion state management hook
export function useAccordion(options?: {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
}) {
  const { type = 'single', defaultValue } = options || {};
  const [value, setValue] = React.useState<string | string[]>(
    defaultValue || (type === 'multiple' ? [] : '')
  );

  const isExpanded = React.useCallback(
    (itemId: string) => {
      if (type === 'multiple') {
        return Array.isArray(value) && value.includes(itemId);
      }
      return value === itemId;
    },
    [value, type]
  );

  const toggle = React.useCallback(
    (itemId: string) => {
      if (type === 'multiple') {
        setValue((prev) => {
          const prevArray = Array.isArray(prev) ? prev : [];
          const index = prevArray.indexOf(itemId);
          if (index === -1) {
            return [...prevArray, itemId];
          }
          return prevArray.filter((v) => v !== itemId);
        });
      } else {
        setValue((prev) => (prev === itemId ? '' : itemId));
      }
    },
    [type]
  );

  return {
    value,
    setValue,
    isExpanded,
    toggle,
  };
}
