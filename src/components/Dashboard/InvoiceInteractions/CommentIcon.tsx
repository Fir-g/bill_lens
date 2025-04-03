import React, { useState, useRef } from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';
import { Comment } from '../../../types';

interface CommentIconProps {
  comment: Comment;
  onClick: () => void;
  onRemove?: () => void;
}

const CommentIcon: React.FC<CommentIconProps> = ({ comment, onClick, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: comment.position.x - 12, y: comment.position.y - 12 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);
  const isChat = comment.messages.length > 0;
  const Icon = isChat ? MessageCircle : MessageSquare;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Update position
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div
      ref={iconRef}
      className={`absolute cursor-grab group ${isDragging ? 'cursor-grabbing z-50' : ''}`}
      style={{ 
        top: position.y,
        left: position.x,
        userSelect: 'none',
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <div className="relative">
        <Icon
          size={24} 
          className={`${isChat ? 'text-blue-500 hover:text-blue-600' : 'text-orange-500 hover:text-orange-600'} transition-colors`}
        />
        {isChat && comment.messages.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {comment.messages.length}
          </div>
        )}
        {!isChat && comment.text && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {comment.text}
          </div>
        )}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full 
              flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentIcon;