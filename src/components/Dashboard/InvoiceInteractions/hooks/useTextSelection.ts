import { useState, useCallback, useEffect } from 'react';

interface ContextMenuPosition {
  x: number;
  y: number;
  selectedText: string;
  range: Range;
}

export const useTextSelection = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    
    if (!selection || selection.isCollapsed) {
      setContextMenu(null);
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      setContextMenu(null);
      return;
    }

    const range = selection.getRangeAt(0);
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      selectedText,
      range
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      closeContextMenu();
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [closeContextMenu]);

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu
  };
};

export type { ContextMenuPosition };