import React, { useRef, useEffect, useState } from 'react';
import { Invoice, Flag, ChatMessage } from '../../types';
import { Mail, Info, CheckCircle, XCircle, Flag as FlagIcon, Send, Bot } from 'lucide-react';

interface InvoiceViewerProps {
  invoice: Invoice;
  onClose: () => void;
  onFlagAction: (invoiceId: string, flagId: string, action: string) => void;
}

const actionInfo = {
  acknowledge: "Share this flag with the vendor via email",
  reject: "Mark this as not a valid flag",
  resolve: "Flag was valid but has been resolved"
};

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ invoice, onClose, onFlagAction }) => {
  const [selectedFlag, setSelectedFlag] = useState<Flag | null>(null);
  const [showActionInfo, setShowActionInfo] = useState(false);
  const [hoveredFlag, setHoveredFlag] = useState<Flag | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(invoice.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFlagAction = async (flag: Flag, action: 'acknowledge' | 'reject' | 'resolve') => {
    if (action === 'acknowledge') {
      setIsSharing(true);
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSharing(false);
    }

    onFlagAction(invoice.id, flag.id, action);
    setSelectedFlag(null);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `I've analyzed your question about "${newMessage}". Based on the invoice data and our benchmarks, this appears to be within normal parameters. However, I recommend reviewing the specific line items for any potential discrepancies.`,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getFlagStatusColor = (type: Flag['type']) => {
    switch (type) {
      case 'open': return 'bg-amber-100 text-amber-800 border-amber-400';
      case 'acknowledged': return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-400';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  const getHighlightColor = (type: Flag['type']) => {
    switch (type) {
      case 'open': return 'bg-amber-200/50';
      case 'acknowledged': return 'bg-blue-200/50';
      case 'rejected': return 'bg-red-200/50';
      case 'resolved': return 'bg-green-200/50';
      default: return 'bg-gray-200/50';
    }
  };

  const renderInvoiceContent = () => {
    const lines = [
      { text: 'LEGAL INVOICE', y: 40 },
      { text: 'Prestige Legal Group, LLP', y: 70 },
      { text: '123 Barrister Lane', y: 100 },
      { text: 'New York, NY 10001', y: 130 },
      { text: `Invoice #: ${invoice.invoiceNo}`, y: 190 },
      { text: `Date: ${invoice.date}`, y: 220 },
      { text: 'Date          Description                                Hours    Rate      Amount', y: 280 },
      { text: '2025-03-04    Initial consultation (in-person)          1.5      $250/hr   $375.00', y: 310 },
      { text: '2025-03-06    Review of contract documents              2.0      $250/hr   $500.00', y: 340 },
      { text: '2025-03-10    Drafting legal memorandum                3.0      $250/hr   $750.00', y: 370 },
      { text: '2025-03-12    Client correspondence and revisions       1.0      $250/hr   $250.00', y: 400 },
      { text: '2025-03-15    Filing and court fee                     N/A      Fixed Fee  $150.00', y: 430 },
      { text: 'Subtotal: $2,025.00', y: 490 },
      { text: 'Tax (0%): $0.00', y: 520 },
      { text: 'Total Due: $2,025.00', y: 550 }
    ];

    return (
      <div className="relative font-mono text-sm leading-6">
        {lines.map((line, index) => (
          <div
            key={index}
            className="absolute whitespace-pre"
            style={{ top: line.y }}
          >
            {line.text}
          </div>
        ))}

        {/* Flag Highlights */}
        {invoice.flags.map((flag) => (
          <div
            key={flag.id}
            className={`absolute cursor-pointer transition-all ${
              (selectedFlag?.id === flag.id || hoveredFlag?.id === flag.id) 
                ? getHighlightColor(flag.type) 
                : 'hover:' + getHighlightColor(flag.type)
            }`}
            style={{
              top: flag.position?.y - 4,
              left: flag.position?.x,
              width: '400px',
              height: '24px',
              borderLeft: `2px solid ${flag.type === 'open' ? '#f59e0b' : 
                flag.type === 'acknowledged' ? '#3b82f6' : 
                flag.type === 'rejected' ? '#ef4444' : '#10b981'}`
            }}
            onClick={() => setSelectedFlag(flag)}
            onMouseEnter={() => setHoveredFlag(flag)}
            onMouseLeave={() => setHoveredFlag(null)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-stretch z-50">
      <div ref={modalRef} className="bg-white w-full flex">
        {/* Invoice Content */}
        <div className="flex-1 overflow-y-auto border-r">
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Invoice #{invoice.invoiceNo}</h2>
                <p className="text-gray-600">Issued: {invoice.date}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-white p-8 rounded-lg min-h-[80vh] relative border shadow-sm">
              {renderInvoiceContent()}
            </div>
          </div>
        </div>

        {/* Flags Panel */}
        <div className="w-96 border-r flex flex-col">
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
            <div className="flex items-center space-x-2">
              <FlagIcon className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">AI-Generated Flags</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowActionInfo(!showActionInfo)}
              >
                <Info size={16} />
              </button>
            </div>

            {showActionInfo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-900">Available Actions</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  {Object.entries(actionInfo).map(([action, info]) => (
                    <li key={action} className="flex items-start space-x-2">
                      <span className="font-medium capitalize">{action}:</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {invoice.flags.map((flag) => (
                <div 
                  key={flag.id} 
                  className={`p-4 rounded-lg transition-all ${getFlagStatusColor(flag.type)} ${
                    selectedFlag?.id === flag.id ? 'ring-2 ring-blue-500' : ''
                  } ${hoveredFlag?.id === flag.id ? 'ring-1 ring-gray-400' : ''}`}
                  onClick={() => setSelectedFlag(flag)}
                  onMouseEnter={() => setHoveredFlag(flag)}
                  onMouseLeave={() => setHoveredFlag(null)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium mb-2">{flag.description}</p>
                      {flag.actionTaken && (
                        <p className="text-sm">
                          Action taken: {flag.actionTaken} on {new Date(flag.actionDate!).toLocaleDateString()}
                        </p>
                      )}
                      {flag.sharedWithVendor && (
                        <p className="text-sm flex items-center mt-1">
                          <Mail size={14} className="mr-1" />
                          Shared with vendor
                        </p>
                      )}
                    </div>
                  </div>

                  {flag.type === 'open' && (
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleFlagAction(flag, 'acknowledge')}
                        disabled={isSharing}
                        className={`flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg transition-colors ${
                          isSharing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                        }`}
                      >
                        {isSharing ? (
                          <>
                            <span className="animate-pulse">Sharing...</span>
                          </>
                        ) : (
                          <>
                            <Mail size={16} />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleFlagAction(flag, 'reject')}
                        disabled={isSharing}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {flag.type === 'acknowledged' && (
                    <button
                      onClick={() => handleFlagAction(flag, 'resolve')}
                      className="flex items-center space-x-1 px-3 py-1 mt-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle size={16} />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-96 flex flex-col bg-gray-50">
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Chat with AI Assistant</h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
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
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about this invoice..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="p-2 bg-[#57CC99] text-white rounded-lg hover:bg-[#4BB587] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;