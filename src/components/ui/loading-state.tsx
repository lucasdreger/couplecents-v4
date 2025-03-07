import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  fullscreen?: boolean;
  skeleton?: React.ReactNode;
  className?: string;
  spinnerSize?: number;
}

export function LoadingState({
  loading,
  children,
  loadingText = 'Loading...',
  fullscreen = false,
  skeleton,
  className,
  spinnerSize = 24
}: LoadingStateProps) {
  const content = loading ? (
    skeleton || (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 
          className="animate-spin" 
          size={spinnerSize}
        />
        {loadingText && (
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        )}
      </div>
    )
  ) : (
    children
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className={cn('relative min-h-[100px]', className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          {content}
        </div>
      )}
      <div className={cn(loading && 'opacity-50 pointer-events-none')}>
        {children}
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TableRowSkeleton({ columns }: { columns: number }) {
  return (
    <div className="flex gap-4 p-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 flex-1"
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function FormSkeleton({ fields }: { fields: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}