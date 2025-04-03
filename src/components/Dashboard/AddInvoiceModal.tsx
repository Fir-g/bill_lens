import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileText } from 'lucide-react';
import { Bars } from 'react-loading-icons';
import { Invoice } from '../../types';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invoice: Invoice) => void;
}

const AIAnalysisSteps = [
  "Analyzing document...",
  "Comparing to agreements...",
  "Rationalizing content...",
  "Identifying flags..."
];

const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${randomNum}`;
};

const generateRandomAmount = () => {
  return Math.floor(Math.random() * (10000 - 1000) + 1000);
};

const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleSubmit = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis steps
    for (let i = 0; i < AIAnalysisSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Create a new invoice with dummy data
    const newInvoice: Invoice = {
      id: Math.random().toString(),
      invoiceNo: generateInvoiceNumber(),
      date: new Date().toLocaleDateString(),
      amount: generateRandomAmount(),
      lawFirmId: '1', // Using first law firm as default
      documents: [file.name],
      flags: [
        {
          id: Math.random().toString(),
          type: 'open',
          description: 'Review required: New service charge pattern detected',
          position: { x: 150, y: 100 }
        }
      ],
      status: 'analyzed',
      comments: [],
      highlights: []
    };

    onSubmit(newInvoice);
    setIsAnalyzing(false);
    setFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-[#2D4356] mb-6">Add New Invoice</h2>

        {isAnalyzing ? (
          <div className="text-center py-8">
            <Bars className="mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">{AIAnalysisSteps[currentStep]}</p>
          </div>
        ) : (
          <>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-[#57CC99] bg-[#57CC99]/10' : 'border-gray-300 hover:border-[#57CC99]'}`}
            >
              <input {...getInputProps()} />
              
              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText size={24} className="text-[#57CC99]" />
                  <span className="text-gray-700">{file.name}</span>
                </div>
              ) : (
                <div>
                  <Upload size={32} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">
                    Drag and drop your invoice here, or click to select
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports PDF files
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!file}
                className={`px-4 py-2 rounded-lg text-white
                  ${file ? 'bg-[#57CC99] hover:bg-[#4BB587]' : 'bg-gray-300 cursor-not-allowed'}
                  transition-colors`}
              >
                Upload & Analyze
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddInvoiceModal;