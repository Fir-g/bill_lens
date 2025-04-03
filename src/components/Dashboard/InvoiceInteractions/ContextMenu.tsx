import React from 'react';
import { HighlighterIcon, MessageSquare, MessageCircle } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onHighlight: () => void;
  onComment: () => void;
  onChat: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onHighlight,
  onComment,
  onChat
}) => {
  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl border py-1"
      style={{ top: y, left: x }}
    >
      <button
        onClick={onHighlight}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <HighlighterIcon size={16} className="mr-2" />
        Highlight Text
      </button>
      <button
        onClick={onComment}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <MessageSquare size={16} className="mr-2" />
        Add Comment
      </button>
      <button
        onClick={onChat}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <MessageCircle size={16} className="mr-2" />
        Chat with Vendor
      </button>
    </div>
  );
};

export default ContextMenu;