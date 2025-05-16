
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'ccp' | 'baridiMob' | 'cash' | 'other';
  isDefault: boolean;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  reference?: string;
  notes?: string;
}

export interface SalesData {
  date: string;
  amount: number;
}

export interface CategoryData {
  name: string;
  value: number;
}
