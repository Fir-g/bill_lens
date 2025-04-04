import React, { useState } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { FormData } from '../types';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const CreateCaseModal: React.FC<CreateCaseModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    caseNumber: '',
    category: '',
    subCategory: '',
    state: '',
    country: '',
    targetBudget: 0,
    lawFirms: [{ name: '', email: '', leadLawyer: '' }]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addLawFirm = () => {
    setFormData({
      ...formData,
      lawFirms: [...formData.lawFirms, { name: '', email: '', leadLawyer: '' }]
    });
  };

  const removeLawFirm = (index: number) => {
    const newLawFirms = formData.lawFirms.filter((_, i) => i !== index);
    setFormData({ ...formData, lawFirms: newLawFirms });
  };

  const updateLawFirm = (index: number, field: string, value: string | File) => {
    const newLawFirms = formData.lawFirms.map((firm, i) => {
      if (i === index) {
        if (field === 'agreementFile' && value instanceof File) {
          return { ...firm, agreementFile: value };
        }
        return { ...firm, [field]: value };
      }
      return firm;
    });
    setFormData({ ...formData, lawFirms: newLawFirms });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl relative animate-fadeIn max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-[#2D4356]">Create a Case</h2>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case No.
                </label>
                <input
                  type="text"
                  value={formData.caseNumber}
                  onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Civil">Civil</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Family">Family</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Category
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                  required
                >
                  <option value="">Select sub-category</option>
                  <option value="Contract">Contract</option>
                  <option value="Property">Property</option>
                  <option value="Employment">Employment</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Budget
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.targetBudget}
                  onChange={(e) => setFormData({ ...formData, targetBudget: parseFloat(e.target.value) })}
                  className="w-full p-2 pl-8 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Law Firms Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#2D4356]">Law Firms</h3>
                <button
                  type="button"
                  onClick={addLawFirm}
                  className="flex items-center space-x-2 text-[#57CC99] hover:text-[#4BB587]"
                >
                  <Plus size={16} />
                  <span>Add Another Law Firm</span>
                </button>
              </div>

              {formData.lawFirms.map((firm, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-700">Law Firm #{index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeLawFirm(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Firm Name
                      </label>
                      <input
                        type="text"
                        value={firm.name}
                        onChange={(e) => updateLawFirm(index, 'name', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={firm.email}
                        onChange={(e) => updateLawFirm(index, 'email', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lead Lawyer
                    </label>
                    <input
                      type="text"
                      value={firm.leadLawyer}
                      onChange={(e) => updateLawFirm(index, 'leadLawyer', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
                      required
                      placeholder="Enter lead lawyer's name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agreement File
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) updateLawFirm(index, 'agreementFile', file);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center space-x-2 p-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                        <Upload size={16} />
                        <span>{firm.agreementFile ? firm.agreementFile.name : 'Upload Agreement'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#57CC99] text-white rounded-lg hover:bg-[#4BB587] transition-colors"
            >
              Create Case
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCaseModal;