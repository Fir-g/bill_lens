import { useState, useCallback } from 'react';
import { TextHighlight } from '../../../../types';
import { HIGHLIGHT_COLOR } from '../constants';

export const useHighlights = (initialHighlights: TextHighlight[] = []) => {
  const [highlights, setHighlights] = useState<TextHighlight[]>(initialHighlights);

  const addHighlight = useCallback((selection: Selection) => {
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = range.startContainer.parentElement?.getBoundingClientRect();

    if (!containerRect) return;

    const newHighlight: TextHighlight = {
      id: Math.random().toString(),
      text: selection.toString(),
      color: HIGHLIGHT_COLOR,
      position: {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height
      }
    };

    setHighlights(prev => [...prev, newHighlight]);
    return newHighlight;
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  }, []);

  return {
    highlights,
    addHighlight,
    removeHighlight
  };
};