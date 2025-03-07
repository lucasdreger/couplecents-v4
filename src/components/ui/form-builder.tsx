import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './form';
import { Input } from './input';
import { CurrencyInput } from './currency-input';
import { DateInput } from './date-input';
import { Combobox } from './combobox';
import { Textarea } from './textarea';
import { Switch } from './switch';

type FieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'currency'
  | 'date'
  | 'select'
  | 'textarea'
  | 'switch';

interface SelectOption {
  value: string;
  label: string;
}

interface BaseFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  placeholder?: string;
  required?: boolean;
}

interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'password';
}

interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number';
  min?: number;
  max?: number;
}

interface CurrencyFieldConfig extends BaseFieldConfig {
  type: 'currency';
}

interface DateFieldConfig extends BaseFieldConfig {
  type: 'date';
}

interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: SelectOption[];
}

interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  rows?: number;
}

interface SwitchFieldConfig extends BaseFieldConfig {
  type: 'switch';
}

type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | CurrencyFieldConfig
  | DateFieldConfig
  | SelectFieldConfig
  | TextareaFieldConfig
  | SwitchFieldConfig;

interface FormBuilderProps<T> {
  form: UseFormReturn<T>;
  fields: FieldConfig[];
  className?: string;
}

export function FormBuilder<T>({
  form,
  fields,
  className
}: FormBuilderProps<T>) {
  const renderField = (field: FieldConfig) => {
    const commonProps = {
      placeholder: field.placeholder,
      'aria-label': field.label,
    };

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name as any}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              {(() => {
                switch (field.type) {
                  case 'text':
                  case 'email':
                  case 'password':
                    return (
                      <Input
                        type={field.type}
                        {...formField}
                        {...commonProps}
                      />
                    );
                  case 'number':
                    return (
                      <Input
                        type="number"
                        min={field.min}
                        max={field.max}
                        {...formField}
                        {...commonProps}
                        onChange={e => formField.onChange(Number(e.target.value))}
                      />
                    );
                  case 'currency':
                    return (
                      <CurrencyInput
                        {...formField}
                        {...commonProps}
                      />
                    );
                  case 'date':
                    return (
                      <DateInput
                        {...formField}
                        {...commonProps}
                        value={formField.value ? new Date(formField.value as string) : new Date()}
                        onChange={date => formField.onChange(date.toISOString())}
                      />
                    );
                  case 'select':
                    return (
                      <Combobox
                        {...commonProps}
                        value={formField.value as string}
                        onValueChange={formField.onChange}
                        items={field.options}
                        getValue={item => item.value}
                        getLabel={item => item.label}
                      />
                    );
                  case 'textarea':
                    return (
                      <Textarea
                        {...formField}
                        {...commonProps}
                        rows={field.rows}
                      />
                    );
                  case 'switch':
                    return (
                      <Switch
                        checked={formField.value as boolean}
                        onCheckedChange={formField.onChange}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </FormControl>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className={className}>
      {fields.map(renderField)}
    </div>
  );
}