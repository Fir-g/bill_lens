import React, { useState } from 'react';
import { 
  Flag, Info, Edit2, Save, X, Plus, Trash2, Library, Check,
  Upload, Mail, FileCheck, AlertCircle, Clock, Receipt, Scale
} from 'lucide-react';
import { FlagTemplate, FlagAction, FlagCategory } from '../../types';

const defaultActions: Record<FlagCategory, FlagAction[]> = {
  rates: [
    {
      id: 'request-rate-clarification',
      name: 'Request Rate Clarification',
      description: 'Ask for explanation of rate changes',
      type: 'request',
      icon: Mail
    },
    {
      id: 'verify-agreement',
      name: 'Verify Against Agreement',
      description: 'Compare with agreed rates',
      type: 'verify',
      icon: FileCheck
    }
  ],
  clarification: [
    {
      id: 'request-details',
      name: 'Request Details',
      description: 'Ask for more specific information',
      type: 'request',
      icon: AlertCircle
    }
  ],
  backup: [
    {
      id: 'request-documentation',
      name: 'Request Documentation',
      description: 'Request supporting documents',
      type: 'request',
      icon: Upload
    }
  ],
  repeated: [
    {
      id: 'verify-previous',
      name: 'Verify Previous Billing',
      description: 'Check for duplicate billing',
      type: 'verify',
      icon: Clock
    }
  ],
  time: [
    {
      id: 'request-time-breakdown',
      name: 'Request Time Breakdown',
      description: 'Ask for detailed time allocation',
      type: 'request',
      icon: Clock
    }
  ],
  proof: [
    {
      id: 'request-receipts',
      name: 'Request Receipts',
      description: 'Ask for expense receipts',
      type: 'upload',
      icon: Receipt
    }
  ],
  agreement: [
    {
      id: 'verify-limits',
      name: 'Verify Limits',
      description: 'Check against agreement limits',
      type: 'verify',
      icon: Scale
    }
  ],
  custom: []
};

const libraryFlags: FlagTemplate[] = [
  {
    id: '1',
    name: 'Different Rates',
    description: 'Different from the agreement rates for each position',
    type: 'system',
    category: 'rates',
    isActive: false,
    severity: 'high',
    actions: defaultActions.rates
  },
  {
    id: '2',
    name: 'Requires Clarification',
    description: 'Billed hours on items not clear or vaguely described',
    type: 'system',
    category: 'clarification',
    isActive: false,
    severity: 'medium',
    actions: defaultActions.clarification
  },
  {
    id: '3',
    name: 'Requires Backup',
    description: 'Time spent on document requires backup documentation',
    type: 'system',
    category: 'backup',
    isActive: false,
    severity: 'high',
    actions: defaultActions.backup
  },
  {
    id: '4',
    name: 'Repeated Items',
    description: 'Items with exact description that have been billed before',
    type: 'system',
    category: 'repeated',
    isActive: false,
    severity: 'medium',
    actions: defaultActions.repeated
  },
  {
    id: '5',
    name: 'Time Analysis',
    description: 'Time spent on activity: AI analysis for potentially exaggerated time',
    type: 'system',
    category: 'time',
    isActive: false,
    severity: 'high',
    actions: defaultActions.time
  },
  {
    id: '6',
    name: 'Requires Proof',
    description: 'Out of pocket expenses need supporting documentation',
    type: 'system',
    category: 'proof',
    isActive: false,
    severity: 'medium',
    actions: defaultActions.proof
  },
  {
    id: '7',
    name: 'Agreement Variations',
    description: 'Variations from Agreement: Exceeds agreed limits (e.g., partner hours)',
    type: 'system',
    category: 'agreement',
    isActive: false,
    severity: 'high',
    actions: defaultActions.agreement
  }
];

const Settings: React.FC = () => {
  const [flags, setFlags] = useState<FlagTemplate[]>([]);
  const [editingFlag, setEditingFlag] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [showFlagInfo, setShowFlagInfo] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<FlagTemplate | null>(null);
  const [newFlagData, setNewFlagData] = useState({
    name: '',
    description: '',
    severity: 'medium' as const,
    category: 'custom' as FlagCategory
  });

  const handleAddFromLibrary = (libraryFlag: FlagTemplate) => {
    const isAlreadyAdded = flags.some(f => f.id === libraryFlag.id);
    if (isAlreadyAdded) {
      setFlags(flags.filter(f => f.id !== libraryFlag.id));
    } else {
      setFlags([...flags, { ...libraryFlag, isActive: true }]);
    }
  };

  const handleAddCustomFlag = () => {
    if (!newFlagData.name || !newFlagData.description) return;

    const newFlag: FlagTemplate = {
      id: Math.random().toString(),
      name: newFlagData.name,
      description: newFlagData.description,
      type: 'custom',
      category: newFlagData.category,
      isActive: true,
      severity: newFlagData.severity,
      actions: []
    };

    setFlags([...flags, newFlag]);
    setNewFlagData({
      name: '',
      description: '',
      severity: 'medium',
      category: 'custom'
    });
  };

  const handleEditFlag = (flag: FlagTemplate) => {
    setEditingFlag(flag.id);
    setEditedDescription(flag.description);
  };

  const handleSaveEdit = (flagId: string) => {
    setFlags(flags.map(flag => 
      flag.id === flagId 
        ? { ...flag, description: editedDescription }
        : flag
    ));
    setEditingFlag(null);
  };

  const handleToggleFlag = (id: string) => {
    setFlags(flags.map(flag => 
      flag.id === id ? { ...flag, isActive: !flag.isActive } : flag
    ));
  };

  const handleDeleteFlag = (id: string) => {
    const flag = flags.find(f => f.id === id);
    if (flag?.type === 'system') return;
    setFlags(flags.filter(f => f.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#2D4356]">Flag Management</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Active Flags:</span>
            <span className="px-3 py-1 bg-[#57CC99] text-white rounded-full text-sm font-medium">
              {flags.filter(f => f.isActive).length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Flag Library */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Library className="w-6 h-6 mr-2 text-[#2D4356]" />
                <h2 className="text-xl font-semibold text-[#2D4356]">Flag Library</h2>
              </div>
              <button
                onClick={() => setShowFlagInfo(!showFlagInfo)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Info size={18} />
              </button>
            </div>

            {showFlagInfo && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium mb-2 text-blue-900">About Flag Library</h3>
                <ul className="text-sm space-y-2 text-blue-800">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                    Choose from our curated collection of intelligent flags
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                    Each flag has specific actions that can be taken
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                    Click to add flags to your active monitoring list
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                    System flags have predefined actions, custom flags can be configured
                  </li>
                </ul>
              </div>
            )}

            <div className="space-y-4">
              {libraryFlags.map((flag) => {
                const isSelected = flags.some(f => f.id === flag.id);
                return (
                  <div 
                    key={flag.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isSelected 
                        ? 'border-[#57CC99] bg-[#57CC99]/5' 
                        : 'border-gray-200 hover:border-[#57CC99] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleAddFromLibrary(flag)}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            getSeverityColor(flag.severity)
                          }`}>
                            {flag.severity}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
                            {flag.category}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{flag.name}</h3>
                        <p className="text-sm text-gray-700">{flag.description}</p>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <button
                          onClick={() => setSelectedFlag(selectedFlag?.id === flag.id ? null : flag)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Info size={16} />
                        </button>
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#57CC99] flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                    </div>

                    {/* Actions Panel */}
                    {selectedFlag?.id === flag.id && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Available Actions</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {flag.actions.map(action => {
                            const ActionIcon = action.icon;
                            return (
                              <div 
                                key={action.id}
                                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center space-x-2 mb-1">
                                  <ActionIcon size={16} className="text-gray-600" />
                                  <span className="text-sm font-medium">{action.name}</span>
                                </div>
                                <p className="text-xs text-gray-600">{action.description}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Flags */}
          <div className="space-y-6">
            {/* Add Custom Flag */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Plus className="w-6 h-6 mr-2 text-[#2D4356]" />
                <h2 className="text-xl font-semibold text-[#2D4356]">Add Custom Flag</h2>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Flag name"
                  value={newFlagData.name}
                  onChange={(e) => setNewFlagData({ ...newFlagData, name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent bg-gray-50"
                />
                <textarea
                  placeholder="Flag description"
                  value={newFlagData.description}
                  onChange={(e) => setNewFlagData({ ...newFlagData, description: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent bg-gray-50 h-24 resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newFlagData.severity}
                    onChange={(e) => setNewFlagData({ ...newFlagData, severity: e.target.value as 'high' | 'medium' | 'low' })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent bg-gray-50"
                  >
                    <option value="high">High Severity</option>
                    <option value="medium">Medium Severity</option>
                    <option value="low">Low Severity</option>
                  </select>
                  <button
                    onClick={handleAddCustomFlag}
                    disabled={!newFlagData.name || !newFlagData.description}
                    className="flex items-center justify-center px-4 py-3 bg-[#57CC99] text-white rounded-lg hover:bg-[#4BB587] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Custom Flag
                  </button>
                </div>
              </div>
            </div>

            {/* Active Flag List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <Flag className="w-6 h-6 mr-2 text-[#2D4356]" />
                <h2 className="text-xl font-semibold text-[#2D4356]">Active Flags</h2>
              </div>

              <div className="space-y-4">
                {flags.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Flag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No flags added yet. Select from the library or create a custom flag.</p>
                  </div>
                ) : (
                  flags.map((flag) => (
                    <div 
                      key={flag.id} 
                      className={`p-4 rounded-lg border transition-all ${
                        flag.isActive 
                          ? 'border-gray-200 bg-white' 
                          : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              flag.type === 'system' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {flag.type}
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              getSeverityColor(flag.severity)
                            }`}>
                              {flag.severity}
                            </span>
                          </div>

                          {editingFlag === flag.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent bg-gray-50"
                              />
                              <button
                                onClick={() => handleSaveEdit(flag.id)}
                                className="p-2 text-green-600 hover:text-green-800 transition-colors"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() => setEditingFlag(null)}
                                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <h3 className="font-medium text-gray-900 mb-1">{flag.name}</h3>
                              <p className="text-sm text-gray-700">{flag.description}</p>
                            </>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleToggleFlag(flag.id)}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                              flag.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {flag.isActive ? 'Active' : 'Inactive'}
                          </button>
                          <button
                            onClick={() => handleEditFlag(flag)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          {flag.type === 'custom' && (
                            <button
                              onClick={() => handleDeleteFlag(flag.id)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {flag.actions.length > 0 && (
                        <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2">
                          {flag.actions.map(action => {
                            const ActionIcon = action.icon;
                            return (
                              <button
                                key={action.id}
                                className="flex items-center space-x-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <ActionIcon size={16} />
                                <span>{action.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;