import { useEffect } from 'react';

interface KeyboardShortcuts {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitToView: () => void;
}

export function useKeyboardShortcuts({
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToView,
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          onZoomIn();
          break;
        case '-':
        case '_':
          e.preventDefault();
          onZoomOut();
          break;
        case '0':
          e.preventDefault();
          onResetView();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          onFitToView();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onZoomIn, onZoomOut, onResetView, onFitToView]);
}
