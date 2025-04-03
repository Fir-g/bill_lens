import { DivideIcon as LucideIcon } from 'lucide-react';

export interface Case {
  id: string;
  title: string;
  caseNumber: string;
  category: string;
  state: string;
  country: string;
  lawFirms: LawFirm[];
  status: 'active' | 'past';
  createdAt: string;
  invoices?: Invoice[];
}

export interface LawFirm {
  id: string;
  name: string;
  email: string;
  agreementFile?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  amount: number;
  lawFirmId: string;
  documents: string[];
  flags: Flag[];
  comments: Comment[];
  highlights: TextHighlight[];
  status: 'analyzed' | 'shared' | 'in-review' | 'vendor-responded' | 'paid';
  messages?: ChatMessage[];
  vendorResponses?: VendorResponse[];
}

export interface Flag {
  id: string;
  type: 'open' | 'acknowledged' | 'rejected' | 'resolved';
  description: string;
  position?: { x: number; y: number };
  actionTaken?: string;
  actionDate?: string;
  sharedWithVendor?: boolean;
  vendorResponse?: string;
}

export interface Comment {
  id: string;
  position: { x: number; y: number };
  messages: CommentMessage[];
  createdAt: string;
  selectedText?: string;
  text?: string;
}

export interface CommentMessage {
  id: string;
  text: string;
  sender: string;
  attachments?: string[];
  timestamp: string;
}

export interface TextHighlight {
  id: string;
  text: string;
  color: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface VendorResponse {
  id: string;
  flagId: string;
  explanation: string;
  documents: string[];
  timestamp: string;
}

export interface FormData {
  title: string;
  caseNumber: string;
  category: string;
  subCategory: string;
  state: string;
  country: string;
  lawFirms: {
    name: string;
    email: string;
    agreementFile?: File;
  }[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface FlagCounts {
  open: number;
  acknowledged: number;
  rejected: number;
  resolved: number;
}

export interface FlagTemplate {
  id: string;
  name: string;
  description: string;
  type: 'system' | 'custom';
  isActive: boolean;
  category: FlagCategory;
  severity: 'high' | 'medium' | 'low';
  actions: FlagAction[];
}

export type FlagCategory = 
  | 'rates' 
  | 'clarification' 
  | 'backup' 
  | 'repeated' 
  | 'time' 
  | 'proof' 
  | 'agreement' 
  | 'custom';

export interface FlagAction {
  id: string;
  name: string;
  description: string;
  type: 'request' | 'notify' | 'verify' | 'upload';
  icon: LucideIcon;
}