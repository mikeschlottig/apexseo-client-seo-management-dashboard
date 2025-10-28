import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle } from 'lucide-react';
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  confirmVariant?: 'default' | 'destructive';
  onConfirm: () => Promise<void> | void;
  isDangerous?: boolean;
  showDontAskAgain?: boolean;
  icon?: React.ElementType;
}
export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'destructive',
  onConfirm,
  isDangerous = false,
  showDontAskAgain = false,
  icon: Icon,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      if (dontAskAgain && showDontAskAgain) {
        localStorage.setItem(`dontAsk_${title}`, 'true');
      }
      onClose();
    } catch (error) {
      console.error('Confirm action error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {Icon ? <Icon className="h-5 w-5" /> : isDangerous && <AlertTriangle className="h-5 w-5 text-destructive" />}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {showDontAskAgain && (
          <div className="flex items-center space-x-2 px-6">
            <Checkbox
              id="dontAskAgain"
              checked={dontAskAgain}
              onCheckedChange={(checked) => setDontAskAgain(checked as boolean)}
            />
            <Label htmlFor="dontAskAgain" className="text-sm cursor-pointer">
              Don't ask me again
            </Label>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={confirmVariant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}