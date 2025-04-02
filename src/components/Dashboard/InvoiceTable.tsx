import React, { useState } from 'react';
import { Invoice, Flag, FlagCounts } from '../../types';
import { Flag as FlagIcon, Info, Upload, FileText, Plus } from 'lucide-react';
import { Bars } from 'react-loading-icons';

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
  lawFirms: { id: string; name: string }[];
  selectedLawFirm: string;
  onLawFirmChange: (id: string) => void;
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

const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  invoices, 
  onViewInvoice, 
  lawFirms,
  selectedLawFirm,
  onLawFirmChange
}) => {
  const [showStatusInfo, setShowStatusInfo] = useState<string | null>(null);
  const [analyzingDoc, setAnalyzingDoc] = useState<{invoiceId: string, step: number} | null>(null);
  const [invoiceDocuments, setInvoiceDocuments] = useState<Record<string, string[]>>({});

  const handleViewPDF = (e: React.MouseEvent, documentPath: string) => {
    e.stopPropagation();
    window.open(`/documents/${documentPath}`, '_blank');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, invoiceId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingDoc({ invoiceId, step: 0 });
    
    // Simulate AI analysis steps
    for (let i = 0; i < AIAnalysisSteps.length; i++) {
      setAnalyzingDoc({ invoiceId, step: i });
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Add the new document to the list
    setInvoiceDocuments(prev => ({
      ...prev,
      [invoiceId]: [...(prev[invoiceId] || []), file.name]
    }));

    setAnalyzingDoc(null);
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

  return (
    <div className="space-y-4">
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
                <button 
                  className="ml-1 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowStatusInfo(showStatusInfo ? null : 'status')}
                >
                  <Info size={14} />
                </button>
                {showStatusInfo === 'status' && (
                  <div className="absolute mt-2 p-3 bg-white rounded-lg shadow-lg border z-10 w-64">
                    <ul className="space-y-2 text-xs">
                      {Object.entries(statusInfo).map(([status, info]) => (
                        <li key={status} className="flex items-start space-x-2">
                          <span className={`inline-block w-2 h-2 rounded-full mt-1 ${getStatusColor(status as Invoice['status'])}`} />
                          <span>{info}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices
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
                              className="flex items-center text-blue-600 hover:text-blue-800 w-full text-left"
                            >
                              <FileText size={16} className="mr-2 flex-shrink-0" />
                              <span className="text-sm truncate">{doc}</span>
                            </button>
                          ))}
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileUpload(e, invoice.id)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button 
                              className="flex items-center text-green-600 hover:text-green-800 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Plus size={16} className="mr-1" />
                              Add Supporting Doc
                            </button>
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;