import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';

// Error codes for consistent error handling
export const ErrorCode = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

// Base error type for the application
export interface AppError extends Error {
  code: ErrorCodeType;
  status?: number;
  fieldErrors?: Record<string, string>;
  cause?: Error;
}

// Custom error classes for different error types
export class ValidationError extends Error implements AppError {
  code = ErrorCode.VALIDATION_ERROR;
  fieldErrors: Record<string, string>;

  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class AuthError extends Error implements AppError {
  code: ErrorCodeType;
  status: number;

  constructor(message: string, isUnauthorized = true) {
    super(message);
    this.name = 'AuthError';
    this.code = isUnauthorized ? ErrorCode.UNAUTHORIZED : ErrorCode.FORBIDDEN;
    this.status = isUnauthorized ? 401 : 403;
  }
}

export class NotFoundError extends Error implements AppError {
  code = ErrorCode.NOT_FOUND;
  status = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends Error implements AppError {
  code = ErrorCode.DATABASE_ERROR;
  status = 500;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'DatabaseError';
    this.cause = cause;
  }
}

export class NetworkError extends Error implements AppError {
  code = ErrorCode.NETWORK_ERROR;
  status = 503;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

// Helper functions for error handling
export function isAppError(error: unknown): error is AppError {
  return error instanceof Error && 'code' in error;
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    const appError = error as AppError;
    appError.code = ErrorCode.UNKNOWN_ERROR;
    return appError;
  }

  return {
    name: 'Error',
    message: String(error),
    code: ErrorCode.UNKNOWN_ERROR,
  } as AppError;
}

// Helper function to create field validation errors
export function createFieldError(field: string, message: string): ValidationError {
  return new ValidationError(`Invalid ${field}`, { [field]: message });
}

// Helper function to handle API errors
export async function handleApiError(error: unknown): Promise<never> {
  const appError = toAppError(error);
  
  // Log error for debugging (you can replace this with your logging solution)
  console.error('API Error:', {
    code: appError.code,
    message: appError.message,
    cause: appError.cause,
    stack: appError.stack,
  });

  throw appError;
}