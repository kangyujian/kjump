import { useEffect } from 'react';

/**
 * 键盘快捷键Hook
 */
export function useKeyboardShortcuts(
  onNavigateUp: () => void,
  onNavigateDown: () => void,
  onSelect: () => void,
  onEscape: () => void,
  onDelete?: () => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        if (event.key === 'Escape') {
           event.preventDefault();
           event.target.blur();
           onEscape();
        }
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onNavigateUp();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onNavigateDown();
          break;
        case 'Enter':
          event.preventDefault();
          onSelect();
          break;
        case 'Escape':
          event.preventDefault();
          onEscape();
          break;
        case 'Backspace':
        case 'Delete':
          if (event.metaKey || event.ctrlKey) {
             event.preventDefault();
             onDelete?.();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateUp, onNavigateDown, onSelect, onEscape, onDelete]);
}