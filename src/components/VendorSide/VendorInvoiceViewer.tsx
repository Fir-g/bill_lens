import React, { useState, useRef } from 'react';
import { Invoice, Flag, VendorResponse } from '../../types';
import { Upload, FileText, Send, X } from 'lucide-react';
import { Bars } from 'react-loading-icons';

interface VendorInvoiceViewerProps {
  invoice: Invoice;
  onClose: () => void;
  onSubmitResponse: (response: VendorResponse) => void;
}

const VendorInvoiceViewer: React.FC<VendorInvoiceViewerProps> = ({ 
  invoice, 
  onClose,
  onSubmitResponse 
}) => {
  const [selectedFlag, setSelectedFlag] = useState<Flag | null>(null);
  const [explanation, setExplanation] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUploadedFiles(prev => [...prev, file.name]);
    setIsUploading(false);
  };

  const handleSubmitResponse = () => {
    if (!selectedFlag || !explanation.trim()) return;

    const response: VendorResponse = {
      id: Math.random().toString(),
      flagId: selectedFlag.id,
      explanation,
      documents: uploadedFiles,
      timestamp: new Date().toISOString()
    };

    onSubmitResponse(response);
    setSelectedFlag(null);
    setExplanation('');
    setUploadedFiles([]);
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

        {/* Shared Flags */}
        {invoice.flags
          .filter(flag => flag.sharedWithVendor)
          .map((flag) => (
            <div
              key={flag.id}
              className={`absolute cursor-pointer transition-all ${
                selectedFlag?.id === flag.id 
                  ? 'bg-amber-200/50' 
                  : 'hover:bg-amber-200/50'
              }`}
              style={{
                top: flag.position?.y - 4,
                left: flag.position?.x,
                width: '400px',
                height: '24px',
                borderLeft: '2px solid #f59e0b'
              }}
              onClick={() => setSelectedFlag(flag)}
            />
          ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-stretch z-50">
      <div className="bg-white w-full flex">
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

        {/* Response Panel */}
        <div className="w-96 flex flex-col bg-gray-50">
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Respond to Flags</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Flag Selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Select a Flag to Respond</h4>
                <div className="space-y-3">
                  {invoice.flags
                    .filter(flag => flag.sharedWithVendor)
                    .map(flag => (
                      <button
                        key={flag.id}
                        onClick={() => setSelectedFlag(flag)}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          selectedFlag?.id === flag.id
                            ? 'bg-amber-100 border-amber-400'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        } border`}
                      >
                        <p className="text-sm font-medium">{flag.description}</p>
                      </button>
                    ))}
                </div>
              </div>

              {selectedFlag && (
                <>
                  {/* Response Form */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Your Response</h4>
                    <textarea
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      placeholder="Provide an explanation..."
                      className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                    />
                  </div>

                  {/* Supporting Documents */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Supporting Documents</h4>
                    
                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 bg-white rounded-lg border"
                          >
                            <div className="flex items-center">
                              <FileText size={16} className="text-gray-500 mr-2" />
                              <span className="text-sm">{file}</span>
                            </div>
                            <button
                              onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button */}
                    {isUploading ? (
                      <div className="flex items-center space-x-2 p-2 text-blue-600">
                        <Bars width={16} />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button className="flex items-center space-x-2 p-2 text-blue-600 hover:text-blue-800">
                          <Upload size={16} />
                          <span className="text-sm">Upload Supporting Document</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitResponse}
                    disabled={!explanation.trim()}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-[#57CC99] text-white rounded-lg hover:bg-[#4BB587] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    <span>Submit Response</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorInvoiceViewer;