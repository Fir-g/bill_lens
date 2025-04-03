import React from 'react';
import { TextHighlight as TextHighlightType } from '../../../types';

interface TextHighlightProps {
  highlights: TextHighlightType[];
  onRemove?: (id: string) => void;
}

const TextHighlight: React.FC<TextHighlightProps> = ({ highlights, onRemove }) => {
  return (
    <>
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          className="absolute group"
          style={{
            top: highlight.position.y,
            left: highlight.position.x,
            width: highlight.position.width,
            height: highlight.position.height,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: highlight.color,
              opacity: 0.3,
            }}
          />
          {onRemove && (
            <button
              onClick={() => onRemove(highlight.id)}
              className="absolute -top-4 -right-4 w-4 h-4 bg-red-500 text-white rounded-full 
                flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          )}
          <div className="absolute -bottom-4 left-0 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {highlight.text}
          </div>
        </div>
      ))}
    </>
  );
};

export default TextHighlight;