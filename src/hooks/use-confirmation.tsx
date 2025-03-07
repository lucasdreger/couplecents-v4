import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface UseConfirmationReturn {
  confirm: (options: ConfirmationOptions) => void;
  ConfirmationDialog: React.FC;
}

export function useConfirmation(): UseConfirmationReturn {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ConfirmationOptions | null>(null);

  const confirm = React.useCallback((opt: ConfirmationOptions) => {
    setOptions(opt);
    setIsOpen(true);
  }, []);

  const handleConfirm = React.useCallback(async () => {
    if (options?.onConfirm) {
      await options.onConfirm();
    }
    setIsOpen(false);
  }, [options]);

  const handleCancel = React.useCallback(() => {
    options?.onCancel?.();
    setIsOpen(false);
  }, [options]);

  const ConfirmationDialog = React.useCallback(() => {
    if (!options) return null;

    const {
      title,
      description,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      variant = 'default'
    } = options;

    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                variant === 'destructive'
                  ? 'bg-destructive hover:bg-destructive/90'
                  : undefined
              }
            >
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }, [isOpen, options, handleConfirm, handleCancel]);

  return {
    confirm,
    ConfirmationDialog
  };
}

// Example usage type
export type ConfirmationHandler = (options: ConfirmationOptions) => void;