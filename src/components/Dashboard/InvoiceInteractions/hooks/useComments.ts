import { useState, useCallback } from 'react';
import { Comment, CommentMessage } from '../../../../types';

export const useComments = (initialComments: Comment[] = []) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const addComment = useCallback((position: { x: number; y: number }, selectedText?: string) => {
    const newComment: Comment = {
      id: Math.random().toString(),
      position,
      messages: [],
      createdAt: new Date().toISOString(),
      selectedText,
      text: selectedText ? `Comment: ${selectedText}` : ''
    };

    setComments(prev => [...prev, newComment]);
    setSelectedComment(newComment);
    return newComment;
  }, []);

  const updateComment = useCallback((commentId: string, text: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId
          ? { ...comment, text }
          : comment
      )
    );
    
    // Also update selectedComment if it's the one being modified
    setSelectedComment(prev => 
      prev?.id === commentId
        ? { ...prev, text }
        : prev
    );
  }, []);

  const addMessage = useCallback((commentId: string, text: string) => {
    const userMessage: CommentMessage = {
      id: Math.random().toString(),
      text,
      sender: 'You',
      timestamp: new Date().toISOString()
    };

    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId
          ? { ...comment, messages: [...comment.messages, userMessage] }
          : comment
      )
    );

    // Update selectedComment immediately with the new message
    setSelectedComment(prev => 
      prev?.id === commentId
        ? { ...prev, messages: [...prev.messages, userMessage] }
        : prev
    );

    // Simulate vendor response immediately
    setTimeout(() => {
      const vendorMessage: CommentMessage = {
        id: Math.random().toString(),
        text: "I understand your point. I'll review this and provide a detailed response shortly.",
        sender: 'Vendor',
        timestamp: new Date().toISOString()
      };

      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId
            ? { ...comment, messages: [...comment.messages, vendorMessage] }
            : comment
        )
      );

      // Update selectedComment immediately with vendor response
      setSelectedComment(prev => 
        prev?.id === commentId
          ? { ...prev, messages: [...prev.messages, vendorMessage] }
          : prev
      );
    }, 1000);
  }, []);

  const removeComment = useCallback((id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
    if (selectedComment?.id === id) {
      setSelectedComment(null);
    }
  }, [selectedComment]);

  return {
    comments,
    selectedComment,
    setSelectedComment,
    addComment,
    updateComment,
    addMessage,
    removeComment
  };
};