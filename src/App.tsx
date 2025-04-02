import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CaseCard from './components/CaseCard';
import CreateCaseModal from './components/CreateCaseModal';
import Dashboard from './components/Dashboard/Dashboard';
import Settings from './components/Settings/Settings';
import VendorDashboard from './components/VendorSide/VendorDashboard';
import { mockCases } from './mockData';
import { Case, FormData, LawFirm, Invoice, VendorResponse } from './types';
import { Plus } from 'lucide-react';

function App() {
  const [activeItem, setActiveItem] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isVendorView, setIsVendorView] = useState(false);
  const [currentLawFirm, setCurrentLawFirm] = useState<LawFirm | null>(null);

  const activeCases = cases.filter(c => c.status === 'active');
  const pastCases = cases.filter(c => c.status === 'past');

  const handleCreateCase = (formData: FormData) => {
    const newLawFirms: LawFirm[] = formData.lawFirms.map(firm => ({
      id: Math.random().toString(),
      name: firm.name,
      email: firm.email,
      agreementFile: firm.agreementFile?.name
    }));

    const newCase: Case = {
      id: Math.random().toString(),
      title: formData.title,
      caseNumber: formData.caseNumber,
      category: formData.category,
      state: formData.state,
      country: formData.country,
      lawFirms: newLawFirms,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setCases([newCase, ...cases]);
  };

  const handleCaseClick = (caseData: Case) => {
    setSelectedCase(caseData);
    setActiveItem('dashboard');
  };

  const handleFlagAction = (invoiceId: string, flagId: string, action: string) => {
    setCases(prevCases => 
      prevCases.map(caseItem => {
        if (caseItem.invoices?.some(inv => inv.id === invoiceId)) {
          return {
            ...caseItem,
            invoices: caseItem.invoices.map(invoice => {
              if (invoice.id === invoiceId) {
                // Update invoice status when flag is shared
                const newStatus = action === 'acknowledge' ? 'shared' : invoice.status;
                
                return {
                  ...invoice,
                  status: newStatus,
                  flags: invoice.flags.map(flag => {
                    if (flag.id === flagId) {
                      return {
                        ...flag,
                        type: action === 'acknowledge' ? 'acknowledged' : 
                              action === 'reject' ? 'rejected' : 'resolved',
                        actionTaken: action,
                        actionDate: new Date().toISOString(),
                        sharedWithVendor: action === 'acknowledge'
                      };
                    }
                    return flag;
                  })
                };
              }
              return invoice;
            })
          };
        }
        return caseItem;
      })
    );

    // If flag is shared, automatically switch to vendor view
    if (action === 'acknowledge') {
      setIsVendorView(true);
      const invoice = cases.flatMap(c => c.invoices || []).find(inv => inv.id === invoiceId);
      if (invoice) {
        const lawFirm = cases.flatMap(c => c.lawFirms).find(firm => firm.id === invoice.lawFirmId);
        if (lawFirm) {
          setCurrentLawFirm(lawFirm);
        }
      }
    }
  };

  const handleVendorResponse = (invoiceId: string, response: VendorResponse) => {
    setCases(prevCases => 
      prevCases.map(caseItem => {
        if (caseItem.invoices?.some(inv => inv.id === invoiceId)) {
          return {
            ...caseItem,
            invoices: caseItem.invoices.map(invoice => {
              if (invoice.id === invoiceId) {
                return {
                  ...invoice,
                  status: 'vendor-responded',
                  vendorResponses: [...(invoice.vendorResponses || []), response]
                };
              }
              return invoice;
            })
          };
        }
        return caseItem;
      })
    );
  };

  // Toggle between user and vendor view
  const toggleView = () => {
    setIsVendorView(!isVendorView);
    if (!isVendorView) {
      // Set first law firm as current when switching to vendor view
      setCurrentLawFirm(cases[0].lawFirms[0]);
    }
  };

  const renderContent = () => {
    if (isVendorView) {
      // Get all invoices that have flags shared with the vendor
      const sharedInvoices = cases.flatMap(c => 
        c.invoices?.filter(invoice => 
          invoice.lawFirmId === currentLawFirm?.id && 
          invoice.flags.some(flag => flag.sharedWithVendor)
        ) || []
      );

      return (
        <VendorDashboard
          lawFirm={currentLawFirm!}
          invoices={sharedInvoices}
          onSubmitResponse={handleVendorResponse}
          onBack={() => setIsVendorView(false)}
        />
      );
    }

    switch (activeItem) {
      case 'dashboard':
        return selectedCase ? (
          <Dashboard 
            caseData={selectedCase} 
            onFlagAction={handleFlagAction}
          />
        ) : null;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[#2D4356]">Welcome, Omar</h1>
                  <p className="text-gray-600 mt-1">Manage your legal cases efficiently</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleView}
                    className="px-4 py-2 text-[#57CC99] border border-[#57CC99] rounded-lg hover:bg-[#57CC99] hover:text-white transition-colors"
                  >
                    {isVendorView ? 'Switch to User View' : 'Switch to Vendor View'}
                  </button>
                  
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#57CC99] text-white rounded-lg hover:bg-[#4BB587] transition-colors"
                  >
                    <Plus size={20} />
                    <span>Create New Case</span>
                  </button>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-[#2D4356] mb-4">Active Cases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCases.map(caseItem => (
                    <CaseCard 
                      key={caseItem.id} 
                      caseData={caseItem} 
                      onClick={() => handleCaseClick(caseItem)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2D4356] mb-4">Past Cases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastCases.map(caseItem => (
                    <CaseCard 
                      key={caseItem.id} 
                      caseData={caseItem} 
                      onClick={() => handleCaseClick(caseItem)}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isVendorView && (
        <div className="fixed top-0 left-0 h-screen">
          <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
        </div>
      )}
      
      <main className={`flex-1 ${!isVendorView ? 'ml-64' : ''} overflow-y-auto`}>
        {renderContent()}
      </main>

      {isModalOpen && (
        <CreateCaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateCase}
        />
      )}
    </div>
  );
}

export default App;