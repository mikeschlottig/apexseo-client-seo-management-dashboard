import { useEffect } from 'react';
import { toast } from 'sonner';
export type ShortcutConfig = Record<string, {
  handler: () => void;
  description: string;
  showToast?: boolean;
}>;
export function useKeyboardShortcuts(shortcuts: ShortcutConfig) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;
      // Build key combination string
      let combo = '';
      if (ctrl) combo += 'ctrl+';
      if (shift) combo += 'shift+';
      if (alt) combo += 'alt+';
      combo += key;
      // Check for exact match first
      if (shortcuts[combo]) {
        event.preventDefault();
        shortcuts[combo].handler();
        if (shortcuts[combo].showToast) {
          toast.info(shortcuts[combo].description);
        }
        return;
      }
      // Check for simple key match (no modifiers)
      if (!ctrl && !shift && !alt && shortcuts[key]) {
        event.preventDefault();
        shortcuts[key].handler();
        if (shortcuts[key].showToast) {
          toast.info(shortcuts[key].description);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
  return Object.entries(shortcuts).map(([key, config]) => ({
    key,
    description: config.description,
  }));
}