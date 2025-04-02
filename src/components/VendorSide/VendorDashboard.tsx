import React, { useState } from 'react';
import { Invoice, LawFirm, VendorResponse } from '../../types';
import { FileText, Flag, Clock, ArrowLeft } from 'lucide-react';
import VendorInvoiceViewer from './VendorInvoiceViewer';

interface VendorDashboardProps {
  lawFirm: LawFirm;
  invoices: Invoice[];
  onSubmitResponse: (invoiceId: string, response: VendorResponse) => void;
  onBack: () => void;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ 
  lawFirm, 
  invoices,
  onSubmitResponse,
  onBack
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleSubmitResponse = (response: VendorResponse) => {
    if (!selectedInvoice) return;
    onSubmitResponse(selectedInvoice.id, response);
    setSelectedInvoice(null);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'shared': return 'bg-yellow-100 text-yellow-800';
      case 'in-review': return 'bg-purple-100 text-purple-800';
      case 'vendor-responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'shared': return Flag;
      case 'in-review': return Clock;
      case 'vendor-responded': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to User View
            </button>
            <h1 className="text-3xl font-bold text-[#2D4356]">{lawFirm.name}</h1>
            <p className="text-gray-600 mt-1">{lawFirm.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-[#2D4356]">Invoices Requiring Attention</h2>
          </div>

          <div className="divide-y">
            {invoices.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Flag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No invoices require your attention at this time.</p>
              </div>
            ) : (
              invoices.map(invoice => {
                const StatusIcon = getStatusIcon(invoice.status);
                const sharedFlags = invoice.flags.filter(flag => flag.sharedWithVendor);
                
                return (
                  <div 
                    key={invoice.id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            Invoice #{invoice.invoiceNo}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status.replace('-', ' ')}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                          <p>Date: {invoice.date}</p>
                          <p>Amount: ${invoice.amount.toLocaleString()}</p>
                        </div>

                        <div className="space-y-2">
                          {sharedFlags.map(flag => (
                            <div 
                              key={flag.id}
                              className="flex items-start space-x-2 text-sm"
                            >
                              <Flag size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                              <span>{flag.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <StatusIcon size={24} className="text-gray-400" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <VendorInvoiceViewer
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onSubmitResponse={handleSubmitResponse}
        />
      )}
    </div>
  );
};

export default VendorDashboard;