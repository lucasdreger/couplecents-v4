import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

export type NotificationVariant = 'default' | 'success' | 'warning' | 'error';
export type NotificationPlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface NotificationProps {
  id: string;
  title: string;
  message?: string;
  variant?: NotificationVariant;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const variants = {
  initial: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
};

const variantStyles: Record<NotificationVariant, string> = {
  default: 'bg-background border',
  success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900',
  warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900',
  error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900',
};

export function Notification({
  id,
  title,
  message,
  variant = 'default',
  duration = 5000,
  onClose,
  action,
  className,
}: NotificationProps) {
  React.useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <motion.div
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={cn(
        'w-full max-w-sm pointer-events-auto overflow-hidden rounded-lg border shadow-lg',
        variantStyles[variant],
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-medium">{title}</p>
            {message && (
              <p className="mt-1 text-sm text-muted-foreground">{message}</p>
            )}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={buttonVariants({ size: 'sm' })}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => onClose(id)}
            className="ml-4 inline-flex flex-shrink-0 rounded-md p-1 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface NotificationGroupProps {
  children: React.ReactNode;
  placement?: NotificationPlacement;
  className?: string;
}

const placementStyles: Record<NotificationPlacement, string> = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
};

export function NotificationGroup({
  children,
  placement = 'top-right',
  className,
}: NotificationGroupProps) {
  return (
    <div
      className={cn(
        'fixed z-50 m-4 flex flex-col gap-2',
        placementStyles[placement],
        className
      )}
    >
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  );
}