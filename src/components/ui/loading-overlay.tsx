import React from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './loading-spinner';
import { motion } from 'framer-motion';
import { getAnimation } from '@/lib/animations';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  className?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  blur?: boolean;
}

export function LoadingOverlay({
  isLoading,
  text = 'Loading...',
  className,
  spinnerSize = 'md',
  blur = true
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      {...getAnimation('fadeIn', 'easeInOut')}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        blur ? 'backdrop-blur-sm' : 'bg-background/80',
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size={spinnerSize} />
        {text && (
          <p className="text-sm font-medium text-muted-foreground">
            {text}
          </p>
        )}
      </div>
    </motion.div>
  );
}