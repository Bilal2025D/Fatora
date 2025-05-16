
import { Product, Customer, Invoice, Payment, SalesData, CategoryData } from "@/types";

// Mock Products
export const products: Product[] = [
  {
    id: "p1",
    name: "Laptop Asus VivoBook",
    description: "15.6-inch FHD, Intel Core i5, 8GB RAM, 512GB SSD",
    price: 85000,
    category: "Electronics",
    stock: 15,
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-01-10T09:00:00Z"
  },
  {
    id: "p2",
    name: "Samsung Galaxy S21",
    description: "6.2-inch display, 8GB RAM, 128GB storage, 5G",
    price: 92000,
    category: "Mobile Phones",
    stock: 23,
    createdAt: "2025-01-12T11:30:00Z",
    updatedAt: "2025-01-12T11:30:00Z"
  },
  {
    id: "p3",
    name: "HP LaserJet Pro Printer",
    description: "Wireless laser printer, 20 ppm, duplex printing",
    price: 32500,
    category: "Office Equipment",
    stock: 8,
    createdAt: "2025-01-15T14:45:00Z",
    updatedAt: "2025-01-15T14:45:00Z"
  },
  {
    id: "p4",
    name: "External Hard Drive 2TB",
    description: "USB 3.0, portable storage solution",
    price: 12800,
    category: "Storage",
    stock: 30,
    createdAt: "2025-01-18T10:15:00Z",
    updatedAt: "2025-01-18T10:15:00Z"
  },
  {
    id: "p5",
    name: "Wireless Keyboard and Mouse",
    description: "Ergonomic design, long battery life",
    price: 5400,
    category: "Accessories",
    stock: 45,
    createdAt: "2025-01-20T16:20:00Z",
    updatedAt: "2025-01-20T16:20:00Z"
  }
];

// Mock Customers
export const customers: Customer[] = [
  {
    id: "c1",
    name: "Ahmed Benhadi",
    email: "ahmed.benhadi@example.com",
    phone: "0555123456",
    address: "123 Rue Didouche Mourad, Algiers",
    taxId: "12345678900123",
    createdAt: "2025-01-05T10:30:00Z"
  },
  {
    id: "c2",
    name: "Meriem Belkacemi",
    email: "meriem.belkacemi@example.com",
    phone: "0666789012",
    address: "45 Boulevard Mohamed V, Oran",
    taxId: "45678912300456",
    createdAt: "2025-01-08T14:15:00Z"
  },
  {
    id: "c3",
    name: "Karim Mansouri",
    email: "karim.mansouri@example.com",
    phone: "0777345678",
    address: "78 Avenue de l'ALN, Constantine",
    createdAt: "2025-01-12T09:45:00Z"
  },
  {
    id: "c4",
    name: "Souad Hamidi",
    email: "souad.hamidi@example.com",
    phone: "0599876543",
    address: "12 Rue Abane Ramdane, Annaba",
    taxId: "78912345600789",
    createdAt: "2025-01-15T11:20:00Z"
  }
];

// Mock Invoices
export const invoices: Invoice[] = [
  {
    id: "inv1",
    number: "INV-2025-001",
    customerId: "c1",
    customerName: "Ahmed Benhadi",
    date: "2025-04-10T14:30:00Z",
    dueDate: "2025-04-25T23:59:59Z",
    items: [
      {
        id: "item1",
        productId: "p1",
        name: "Laptop Asus VivoBook",
        description: "15.6-inch FHD, Intel Core i5, 8GB RAM, 512GB SSD",
        quantity: 1,
        unitPrice: 85000,
        taxRate: 19,
        total: 85000
      },
      {
        id: "item2",
        productId: "p5",
        name: "Wireless Keyboard and Mouse",
        description: "Ergonomic design, long battery life",
        quantity: 1,
        unitPrice: 5400,
        taxRate: 19,
        total: 5400
      }
    ],
    subtotal: 90400,
    taxTotal: 17176,
    total: 107576,
    status: "paid",
    createdAt: "2025-04-10T14:30:00Z",
    updatedAt: "2025-04-12T10:15:00Z"
  },
  {
    id: "inv2",
    number: "INV-2025-002",
    customerId: "c2",
    customerName: "Meriem Belkacemi",
    date: "2025-04-15T09:45:00Z",
    dueDate: "2025-04-30T23:59:59Z",
    items: [
      {
        id: "item3",
        productId: "p2",
        name: "Samsung Galaxy S21",
        description: "6.2-inch display, 8GB RAM, 128GB storage, 5G",
        quantity: 1,
        unitPrice: 92000,
        taxRate: 19,
        total: 92000
      }
    ],
    subtotal: 92000,
    taxTotal: 17480,
    total: 109480,
    status: "sent",
    createdAt: "2025-04-15T09:45:00Z",
    updatedAt: "2025-04-15T09:45:00Z"
  },
  {
    id: "inv3",
    number: "INV-2025-003",
    customerId: "c3",
    customerName: "Karim Mansouri",
    date: "2025-04-18T16:20:00Z",
    dueDate: "2025-05-03T23:59:59Z",
    items: [
      {
        id: "item4",
        productId: "p3",
        name: "HP LaserJet Pro Printer",
        description: "Wireless laser printer, 20 ppm, duplex printing",
        quantity: 1,
        unitPrice: 32500,
        taxRate: 19,
        total: 32500
      },
      {
        id: "item5",
        productId: "p4",
        name: "External Hard Drive 2TB",
        description: "USB 3.0, portable storage solution",
        quantity: 2,
        unitPrice: 12800,
        taxRate: 19,
        total: 25600
      }
    ],
    subtotal: 58100,
    taxTotal: 11039,
    total: 69139,
    status: "draft",
    createdAt: "2025-04-18T16:20:00Z",
    updatedAt: "2025-04-18T16:20:00Z"
  },
  {
    id: "inv4",
    number: "INV-2025-004",
    customerId: "c4",
    customerName: "Souad Hamidi",
    date: "2025-04-20T11:10:00Z",
    dueDate: "2025-05-05T23:59:59Z",
    items: [
      {
        id: "item6",
        productId: "p1",
        name: "Laptop Asus VivoBook",
        description: "15.6-inch FHD, Intel Core i5, 8GB RAM, 512GB SSD",
        quantity: 1,
        unitPrice: 85000,
        taxRate: 19,
        total: 85000
      }
    ],
    subtotal: 85000,
    taxTotal: 16150,
    total: 101150,
    status: "overdue",
    createdAt: "2025-04-20T11:10:00Z",
    updatedAt: "2025-04-20T11:10:00Z"
  }
];

// Mock Payments
export const payments: Payment[] = [
  {
    id: "pay1",
    invoiceId: "inv1",
    amount: 107576,
    date: "2025-04-12T10:15:00Z",
    method: "baridiMob",
    reference: "BM123456789",
    notes: "Payment received in full"
  },
  {
    id: "pay2",
    invoiceId: "inv2",
    amount: 50000,
    date: "2025-04-20T15:30:00Z",
    method: "ccp",
    reference: "CCP987654321",
    notes: "Partial payment received"
  }
];

// Mock Sales Data for Chart
export const salesData: SalesData[] = [
  { date: "2025-01", amount: 320000 },
  { date: "2025-02", amount: 450000 },
  { date: "2025-03", amount: 380000 },
  { date: "2025-04", amount: 520000 },
  { date: "2025-05", amount: 480000 },
];

// Mock Category Data for Chart
export const categoryData: CategoryData[] = [
  { name: "Electronics", value: 42 },
  { name: "Mobile Phones", value: 28 },
  { name: "Office Equipment", value: 15 },
  { name: "Storage", value: 10 },
  { name: "Accessories", value: 5 }
];
