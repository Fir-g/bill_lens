import React, { useState } from 'react';
import { Case, Invoice } from '../../types';
import InvoiceTable from './InvoiceTable';
import ExpensesChart from './ExpensesChart';
import InvoiceViewer from './InvoiceViewer';
import AddInvoiceModal from './AddInvoiceModal';
import { Plus } from 'lucide-react';

interface DashboardProps {
  caseData: Case;
  onFlagAction: (invoiceId: string, flagId: string, action: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ caseData, onFlagAction }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(caseData.invoices || []);
  const [selectedLawFirm, setSelectedLawFirm] = useState('');

  const handleAddInvoice = (newInvoice: Invoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2D4356]">{caseData.title}</h1>
            <p className="text-gray-600 mt-1">Case #{caseData.caseNumber}</p>
          </div>
          
          {/* <button
            onClick={() => setIsAddInvoiceModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#57CC99] text-white rounded-lg hover:bg-[#4BB587] transition-colors"
          >
            <Plus size={20} />
            <span>Add New Invoice</span>
          </button> */}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#2D4356] mb-4">Invoices</h2>
          <InvoiceTable 
            invoices={invoices}
            onViewInvoice={(invoice) => setSelectedInvoice(invoice)}
            lawFirms={caseData.lawFirms}
            selectedLawFirm={selectedLawFirm}
            onLawFirmChange={setSelectedLawFirm}
            onUpdateInvoice={handleUpdateInvoice}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#2D4356] mb-4">Expenses Analysis</h2>
          <ExpensesChart />
        </div>

        {selectedInvoice && (
          <InvoiceViewer
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            onFlagAction={onFlagAction}
          />
        )}

        <AddInvoiceModal
          isOpen={isAddInvoiceModalOpen}
          onClose={() => setIsAddInvoiceModalOpen(false)}
          onSubmit={handleAddInvoice}
        />
      </div>
    </div>
  );
};

export default Dashboard;