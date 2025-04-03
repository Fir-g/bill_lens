import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, GripHorizontal } from 'lucide-react';
import { Comment, CommentMessage } from '../../../types';

interface ChatBoxProps {
  comment: Comment;
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onRemove?: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ 
  comment, 
  onClose, 
  onSendMessage, 
  onRemove,
  onPositionChange 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: comment.position.x + 40, y: comment.position.y });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comment.messages, isTyping]);

  useEffect(() => {
    if (!chatBoxRef.current) return;

    // Ensure chat box stays within viewport
    const box = chatBoxRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newX = position.x;
    let newY = position.y;

    if (box.right > viewport.width) {
      newX = viewport.width - box.width - 20;
    }
    if (box.bottom > viewport.height) {
      newY = viewport.height - box.height - 20;
    }
    if (newX < 0) newX = 20;
    if (newY < 0) newY = 20;

    if (newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
      onPositionChange?.({ x: newX, y: newY });
    }
  }, [position, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    const box = chatBoxRef.current?.getBoundingClientRect();
    if (box) {
      setDragOffset({
        x: e.clientX - box.left,
        y: e.clientY - box.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    onPositionChange?.(position);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1500);
  };

  return (
    <div
      ref={chatBoxRef}
      className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        top: position.y,
        left: position.x,
        width: '384px',
        maxHeight: '80vh'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="bg-white rounded-lg shadow-xl border flex flex-col" style={{ maxHeight: '80vh' }}>
        <div 
          className="flex items-center justify-between p-3 border-b cursor-grab bg-white sticky top-0 z-10"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <GripHorizontal size={16} className="text-gray-400" />
            <Bot className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium">Chat with Vendor</h3>
          </div>
          <div className="flex items-center space-x-2">
            {onRemove && (
              <button 
                onClick={onRemove}
                className="text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {comment.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'You'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || isTyping}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;