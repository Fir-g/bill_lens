import React, { useState } from 'react';
import { Invoice, Flag, FlagCounts } from '../../types';
import { Flag as FlagIcon, Info, Upload, FileText, Plus } from 'lucide-react';
import { Bars } from 'react-loading-icons';
import PaymentModal from './PaymentModal';

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
  lawFirms: { id: string; name: string }[];
  selectedLawFirm: string;
  onLawFirmChange: (id: string) => void;
  onUpdateInvoice?: (updatedInvoice: Invoice) => void;
}

const AIAnalysisSteps = [
  "Analyzing document...",
  "Comparing to agreements...",
  "Rationalizing content...",
  "Identifying flags..."
];

const statusInfo = {
  analyzed: "Invoice has been reviewed by AI and customer",
  shared: "Review comments sent to the vendor",
  "in-review": "Law firm is reviewing the comments",
  "vendor-responded": "Law firm has provided their response",
  paid: "Invoice has been paid"
};

const formatDocumentName = (name: string) => {
  // Remove file extension
  const baseName = name.replace(/\.[^/.]+$/, "");

  // Split by common delimiters
  const parts = baseName.split(/[-_]/);

  // Capitalize each word and join with spaces
  return parts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${randomNum}`;
};

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onViewInvoice,
  lawFirms,
  selectedLawFirm,
  onLawFirmChange,
  onUpdateInvoice
}) => {
  const [showStatusInfo, setShowStatusInfo] = useState<string | null>(null);
  const [analyzingDoc, setAnalyzingDoc] = useState<{ invoiceId: string, step: number } | null>(null);
  const [invoiceDocuments, setInvoiceDocuments] = useState<Record<string, string[]>>({});
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; invoice: Invoice | null }>({
    isOpen: false,
    invoice: null
  });
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(invoices);

  const handleViewPDF = (e: React.MouseEvent, documentPath: string) => {
    e.stopPropagation();
    window.open(`/documents/${documentPath}`, '_blank');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, invoiceId?: string) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    if (!file) return;

    if (invoiceId) {
      // Adding document to existing invoice
      setAnalyzingDoc({ invoiceId, step: 0 });

      // Simulate AI analysis steps
      for (let i = 0; i < AIAnalysisSteps.length; i++) {
        setAnalyzingDoc({ invoiceId, step: i });
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setInvoiceDocuments(prev => ({
        ...prev,
        [invoiceId]: [...(prev[invoiceId] || []), file.name]
      }));

      setAnalyzingDoc(null);
    } else {
      // Creating new invoice
      const newInvoice: Invoice = {
        id: Math.random().toString(),
        invoiceNo: generateInvoiceNumber(),
        date: new Date().toLocaleDateString(),
        amount: 0,
        lawFirmId: selectedLawFirm || lawFirms[0]?.id || '',
        documents: [file.name],
        flags: [],
        status: 'analyzed',
        comments: [],
        highlights: []
      };

      setLocalInvoices(prev => [newInvoice, ...prev]);
      if (onUpdateInvoice) {
        onUpdateInvoice(newInvoice);
      }
    }
  };

  const getFlagCounts = (flags: Flag[]): FlagCounts => {
    return flags.reduce((acc, flag) => {
      acc[flag.type]++;
      return acc;
    }, { open: 0, acknowledged: 0, rejected: 0, resolved: 0 } as FlagCounts);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'analyzed': return 'bg-blue-100 text-blue-800';
      case 'shared': return 'bg-yellow-100 text-yellow-800';
      case 'in-review': return 'bg-purple-100 text-purple-800';
      case 'vendor-responded': return 'bg-orange-100 text-orange-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePaymentComplete = (invoice: Invoice) => {
    const updatedInvoice = { ...invoice, status: 'paid' as const };

    setLocalInvoices(prev =>
      prev.map(inv => inv.id === invoice.id ? updatedInvoice : inv)
    );

    if (onUpdateInvoice) {
      onUpdateInvoice(updatedInvoice);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Filter by Law Firm:
          </label>
          <select
            value={selectedLawFirm}
            onChange={(e) => onLawFirmChange(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
          >
            <option value="">All Law Firms</option>
            {lawFirms.map(firm => (
              <option key={firm.id} value={firm.id}>
                {firm.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Invoice Button */}
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileUpload(e)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#57CC99] text-white rounded-lg hover:bg-[#4BB587] transition-colors">
            <Plus size={20} />
            <span>Add New Invoice</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Law Firm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localInvoices
              .filter(invoice => !selectedLawFirm || invoice.lawFirmId === selectedLawFirm)
              .map((invoice) => {
                const flagCounts = getFlagCounts(invoice.flags);
                const lawFirm = lawFirms.find(f => f.id === invoice.lawFirmId);
                const isAnalyzing = analyzingDoc?.invoiceId === invoice.id;
                const additionalDocs = invoiceDocuments[invoice.id] || [];
                const allDocuments = [...invoice.documents, ...additionalDocs];

                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => handleViewPDF(e, invoice.documents[0])}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {invoice.invoiceNo}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lawFirm?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAnalyzing ? (
                        <div className="flex items-center space-x-2">
                          <Bars width={16} className="text-blue-500" />
                          <span className="text-sm text-gray-600">{AIAnalysisSteps[analyzingDoc.step]}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {allDocuments.map((doc, index) => (
                            <button
                              key={index}
                              onClick={(e) => handleViewPDF(e, doc)}
                              className="flex items-center text-blue-600 hover:text-blue-800 w-full text-left group"
                            >
                              <FileText size={16} className="mr-2 flex-shrink-0" />
                              <span className="text-sm truncate group-hover:underline">
                                {formatDocumentName(doc)}
                              </span>
                            </button>
                          ))}
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileUpload(e, invoice.id)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex items-center text-green-600 hover:text-green-800 text-sm cursor-pointer">
                              <Plus size={16} className="mr-1" />
                              <span>+ Add Supporting Doc</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {flagCounts.open > 0 && (
                          <button
                            onClick={() => onViewInvoice(invoice)}
                            className="flex items-center text-amber-500 hover:text-amber-600"
                          >
                            <FlagIcon size={14} className="mr-1" />
                            <span className="text-sm">{flagCounts.open} Open</span>
                          </button>
                        )}
                        {flagCounts.acknowledged > 0 && (
                          <button
                            onClick={() => onViewInvoice(invoice)}
                            className="flex items-center text-blue-500 hover:text-blue-600"
                          >
                            <FlagIcon size={14} className="mr-1" />
                            <span className="text-sm">{flagCounts.acknowledged} Acknowledged</span>
                          </button>
                        )}
                        {flagCounts.rejected > 0 && (
                          <button
                            onClick={() => onViewInvoice(invoice)}
                            className="flex items-center text-red-500 hover:text-red-600"
                          >
                            <FlagIcon size={14} className="mr-1" />
                            <span className="text-sm">{flagCounts.rejected} Rejected</span>
                          </button>
                        )}
                        {flagCounts.resolved > 0 && (
                          <button
                            onClick={() => onViewInvoice(invoice)}
                            className="flex items-center text-green-500 hover:text-green-600"
                          >
                            <FlagIcon size={14} className="mr-1" />
                            <span className="text-sm">{flagCounts.resolved} Resolved</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div
                          className="relative group"
                          onMouseEnter={() => setHoveredStatus(invoice.id)}
                          onMouseLeave={() => setHoveredStatus(null)}
                        >
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status.replace('-', ' ')}
                          </span>

                          {hoveredStatus === invoice.id && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border p-3 z-20">
                              <p className="text-sm text-gray-600 leading-snug">
                                {statusInfo[invoice.status]}
                              </p>
                            </div>
                          )}
                        </div>

                        {invoice.status !== 'paid' && (
                          <button
                            onClick={() => setPaymentModal({ isOpen: true, invoice })}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {paymentModal.invoice && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal({ isOpen: false, invoice: null })}
          amount={paymentModal.invoice.amount}
          onPaymentComplete={() => handlePaymentComplete(paymentModal.invoice!)}
        />
      )}
    </div>
  );
};

export default InvoiceTable;