import React from 'react';
import { Case } from '../types';
import { Briefcase, MapPin, Mail, Hash, Building2, DollarSign, UserCircle } from 'lucide-react';

interface CaseCardProps {
  caseData: Case;
  onClick: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ caseData, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-[#2D4356]">{caseData.title}</h3>
        <span className="text-sm bg-[#57CC99] text-white px-3 py-1 rounded-full">
          #{caseData.caseNumber}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Briefcase size={18} className="mr-2 flex-shrink-0" />
          <span>{caseData.category}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin size={18} className="mr-2 flex-shrink-0" />
          <span>{caseData.state}, {caseData.country}</span>
        </div>

        {caseData.targetBudget && (
          <div className="flex items-center text-gray-600">
            <DollarSign size={18} className="mr-2 flex-shrink-0" />
            <span>Target Budget: ${caseData.targetBudget.toLocaleString()}</span>
          </div>
        )}

        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between text-gray-600 mb-3">
            <div className="flex items-center">
              <Building2 size={18} className="mr-2 flex-shrink-0" />
              <span className="font-medium">Associated Law Firms</span>
            </div>
            {caseData.lawFirms.length > 2 && (
              <span className="text-xs text-gray-500">
                +{caseData.lawFirms.length - 2} more
              </span>
            )}
          </div>

          <div className="space-y-3 pl-6 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {caseData.lawFirms.map((firm, index) => (
              <div key={firm.id} className="space-y-1.5">
                <div className="flex items-center text-gray-700">
                  <Building2 size={14} className="mr-2 flex-shrink-0" />
                  <span className="font-medium">{firm.name}</span>
                </div>

                {firm.leadLawyer && (
                  <div className="flex items-center text-gray-600 pl-4">
                    <UserCircle size={14} className="mr-2 flex-shrink-0" />
                    <span className="text-sm">{firm.leadLawyer}</span>
                  </div>
                )}


                <div className="flex items-center text-gray-600 pl-4">
                  <Mail size={14} className="mr-2 flex-shrink-0" />
                  <span className="text-sm">{firm.email}</span>
                </div>

                {index < caseData.lawFirms.length - 1 && (
                  <div className="border-b border-gray-200 my-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseCard;