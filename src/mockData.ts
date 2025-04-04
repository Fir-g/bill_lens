import { Case, Invoice, Flag, ChatMessage } from "./types";

const mockFlags: Flag[] = [
  {
    id: "1",
    type: "open",
    description:
      "Fixed fee charges require supporting documentation and approval",
    position: { x: 40, y: 530 },
    
  },
  {
    id: "2",
    type: "open",
    description: "Contract document review time exceeds standard benchmarks",
    position: { x: 50, y: 340 },
    
  },
  {
    id: "3",
    type: "open",
    description: "Court filing fee is higher than standard rates",
    position: { x: 20, y: 222 },
    
  },
  {
    id: "4",
    type: "open",
    description: "charges for document review are higher than standard rates",
    position: { x: 50, y: 340 },
  },
  {
    id: "5",
    type: "open",
    description: "some provisions are not in line with the agreement",
    position: { x: 40, y: 444 },
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    text: "Can you analyze the fixed fee charges in this invoice?",
    sender: "user",
    timestamp: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    text: "I've analyzed the fixed fee charges. The $150.00 court filing fee requires supporting documentation according to the agreement. Additionally, the standard rate for similar filings in this jurisdiction typically ranges from $100-125. I recommend requesting documentation and clarification on the rate difference.",
    sender: "ai",
    timestamp: "2024-03-20T10:00:05Z",
  },
  {
    id: "3",
    text: "What about the contract document review time?",
    sender: "user",
    timestamp: "2024-03-20T10:01:00Z",
  },
  {
    id: "4",
    text: "The 2.0 hours spent on contract document review appears high compared to our benchmarks. Based on the complexity level and document type, similar reviews typically take 1-1.5 hours. I suggest discussing the specific factors that required additional time with the law firm.",
    sender: "ai",
    timestamp: "2024-03-20T10:01:05Z",
  },
];

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNo: "INV-001",
    date: "1/1/25",
    amount: 2025,
    lawFirmId: "1",
    documents: ["agreement.pdf"],
    flags: mockFlags.filter((flag) => flag.id === "1" || flag.id === "2"),
    status: "analyzed",
    messages: mockMessages,
    comments: [],
    highlights: [],
  },
  {
    id: "2",
    invoiceNo: "INV-002",
    date: "1/1/25",
    amount: 1200,
    lawFirmId: "2",
    documents: ["agreement-2.pdf"],
    flags: mockFlags.filter((flag) => flag.id === "3"), 
    status: "paid",
    comments: [],
    highlights: [],
  },
  {
    id: "3",
    invoiceNo: "INV-003",
    date: "1/1/25",
    amount: 1200,
    lawFirmId: "3",
    documents: ["invoice-2.pdf"],
    flags: mockFlags.filter((flag) => flag.id === "4" ), 
    status: "paid",
    comments: [],
    highlights: [],
  },
  {
    id: "4",
    invoiceNo: "INV-003",
    date: "1/1/25",
    amount: 1200,
    lawFirmId: "4",
    documents: ["agreement-ex5.pdf"],
    flags: mockFlags.filter((flag) => flag.id === "4" || flag.id === "5"), 
    status: "paid",
    comments: [],
    highlights: [],
  },
];

export const mockCases: Case[] = [
  {
    id: "1",
    title: "Shoplifting Case",
    caseNumber: "12345689",
    category: "Misdemeanor",
    state: "Delaware",
    country: "United States",
    lawFirms: [
      {
        id: "1",
        name: "Pearson Hardman",
        email: "contact@pearsonhardman.com",
        agreementFile: "agreement-1.pdf",
        leadLawyer: "Harvey Spector",
      },
      {
        id: "2",
        name: "K. D. Pathak & Associates",
        email: "Adaalat@kd.com",
        agreementFile: "agreement-2.pdf",
        leadLawyer: "K. D. Pathak",
      },
    ],
    status: "active",
    createdAt: "2024-03-15",
    invoices: mockInvoices.filter((invoice) => invoice.id === "2"||invoice.id === "1"),
  },
  {
    id: "2",
    title: "Property Dispute",
    caseNumber: "12345690",
    category: "Civil",
    state: "Texas",
    country: "United States",
    lawFirms: [
      {
        id: "3",
        name: "Zane & Associates",
        email: "contact@zanelaw.com",
        agreementFile: "agreement-2.pdf",
        leadLawyer: "Clerence Pereira",
      },
      {
        id: "4",
        name: "	Boston Legal",
        email: "contact@bostonlegal.com",
        agreementFile: "agreement-1.pdf",
        leadLawyer: "Alan shore",
      },
    ],
    status: "active",
    createdAt: "2024-03-10",
    invoices: mockInvoices.filter((invoice) => invoice.id === "3"||invoice.id === "4"),
  },
  {
    id: "3",
    title: "Insurance Fraud",
    caseNumber: "12345691",
    category: "Criminal",
    state: "New York",
    country: "United States",
    lawFirms: [
      {
        id: "5",
        name: "Smith & Partners",
        email: "contact@smithlaw.com",
        agreementFile: "agreement-3.pdf",
        leadLawyer: "Andrew Oldroyd",
      },
    ],
    status: "past",
    createdAt: "2023-12-15",
  },
  {
    id: "4",
    title: "Workplace Discrimination",
    caseNumber: "12345692",
    category: "Employment",
    state: "California",
    country: "United States",
    lawFirms: [
      {
        id: "6",
        name: "Johnson Legal",
        email: "contact@johnsonlegal.com",
        agreementFile: "agreement-4.pdf",
        leadLawyer: "Harvey Spector",
      },
    ],
    status: "past",
    createdAt: "2023-11-20",
  },
];
