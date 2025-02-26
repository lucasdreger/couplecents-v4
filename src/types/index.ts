import React from 'react';

// Event types
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
export type MouseEvent = React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>;

// Component types
export type ReactNode = React.ReactNode;
export type ReactElement = React.ReactElement;
export type ComponentType<P = any> = React.ComponentType<P>;
export type HTMLProps = React.HTMLAttributes<HTMLElement>;

// Function types
export interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  // Add other properties as needed
}

// Category type
export interface Category {
  id: string;
  name: string;
  // Add other properties as needed
}

// Investment type
export interface Investment {
  id: string;
  name: string;
  amount: number;
  // Add other properties as needed
}

// Expense type
export interface Expense {
  id: string;
  amount: number;
  category?: Category;
  // Add other properties as needed
}

// Fixed expense type
export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  category?: string;
  // Add other properties as needed
}

// Variable expense type
export interface VariableExpense {
  id: string;
  name: string;
  amount: number;
  category?: Category;
  // Add other properties as needed
}

// Reserve type
export interface Reserve {
  id: string;
  name: string;
  amount: number;
  // Add other properties as needed
}
