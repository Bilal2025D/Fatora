import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invoices } from "@/data/mockData";
import { Invoice, InvoiceItem, Customer } from "@/types";
import { FileText, Plus, Search, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

// Mock customers data for the form
const mockCustomers = [
  { id: "c1", name: "Ahmed Benhadi" },
  { id: "c2", name: "Meriem Belkacem" },
  { id: "c3", name: "Mohammed Boudiaf" },
  { id: "c4", name: "Karim Benzema" },
  { id: "c5", name: "Fatima Zahra" },
];

// Mock products for the form
const mockProducts = [
  { id: "p1", name: "Laptop Dell XPS 15", price: 120000 },
  { id: "p2", name: "iPhone 15 Pro", price: 189000 },
  { id: "p3", name: "Samsung TV 55\"", price: 95000 },
  { id: "p4", name: "AirPods Pro", price: 45000 },
  { id: "p5", name: "Canon EOS Camera", price: 75000 },
];

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500 text-white",
  paid: "bg-green-500 text-white",
  overdue: "bg-red-500 text-white",
  cancelled: "bg-gray-500 text-white",
};

const Invoices = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [invoiceData, setInvoiceData] = useState({
    number: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: "",
  });

  // Reference for printing
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Invoice-${invoiceData.number}`,
    onPrintError: () => toast({
      title: "Print failed",
      description: "Failed to print the invoice.",
      variant: "destructive",
    }),
    onAfterPrint: () => toast({
      title: "Print succeeded",
      description: "Invoice has been printed successfully.",
    }),
    removeAfterPrint: true,
    reactToPrintProps: { pageStyle: "@page { size: auto; margin: 10mm; }" },
  });
  
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleCreateInvoice = () => {
    setIsCreateModalOpen(true);
  };
  
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setInvoiceItems([]);
    setSelectedCustomer("");
    setInvoiceData({
      number: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: "",
    });
  };
  
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      productId: "",
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 19,
      total: 0
    };
    
    setInvoiceItems([...invoiceItems, newItem]);
  };
  
  const handleRemoveItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };
  
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoiceItems];
    
    if (field === 'productId' && value) {
      const selectedProduct = mockProducts.find(p => p.id === value);
      if (selectedProduct) {
        newItems[index] = {
          ...newItems[index],
          productId: value,
          name: selectedProduct.name,
          unitPrice: selectedProduct.price,
          total: selectedProduct.price * newItems[index].quantity
        };
      }
    } else if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      // Recalculate total
      const qty = field === 'quantity' ? value : newItems[index].quantity;
      const price = field === 'unitPrice' ? value : newItems[index].unitPrice;
      newItems[index].total = qty * price;
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
    }
    
    setInvoiceItems(newItems);
  };
  
  const calculateInvoiceTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const taxTotal = invoiceItems.reduce((sum, item) => sum + (item.total * (item.taxRate / 100)), 0);
    const total = subtotal + taxTotal;
    
    return { subtotal, taxTotal, total };
  };

  const handleSaveInvoice = () => {
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a customer.",
        variant: "destructive"
      });
      return;
    }
    
    if (invoiceItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the invoice.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would save the invoice to the database here
    toast({
      title: "Success",
      description: "Invoice has been created successfully. This feature will be fully implemented in the next version.",
    });
    
    closeCreateModal();
  };
  
  const handleDownloadInvoice = (invoice: Invoice) => {
    toast({
      title: "Downloading Invoice",
      description: `Downloading invoice ${invoice.number} as PDF...`,
    });
  };

  const InvoiceForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="customer">Customer</Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {mockCustomers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="invoice-number">Invoice Number</Label>
            <Input 
              id="invoice-number" 
              value={invoiceData.number} 
              onChange={(e) => setInvoiceData({...invoiceData, number: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={invoiceData.date} 
              onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="due-date">Due Date</Label>
            <Input 
              id="due-date" 
              type="date" 
              value={invoiceData.dueDate} 
              onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
            />
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddItem}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Tax Rate (%)</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Select 
                      value={item.productId}
                      onValueChange={(value) => handleItemChange(index, 'productId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.taxRate}
                      onChange={(e) => handleItemChange(index, 'taxRate', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>{item.total.toLocaleString()} DA</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      ×
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {invoiceItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No items added yet. Click "Add Item" to add products to this invoice.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {invoiceItems.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex flex-col items-end gap-2">
            <div className="flex justify-between w-full md:w-1/3">
              <span className="font-medium">Subtotal:</span>
              <span>{calculateInvoiceTotals().subtotal.toLocaleString()} DA</span>
            </div>
            <div className="flex justify-between w-full md:w-1/3">
              <span className="font-medium">Tax:</span>
              <span>{calculateInvoiceTotals().taxTotal.toLocaleString()} DA</span>
            </div>
            <div className="flex justify-between w-full md:w-1/3 text-lg font-bold">
              <span>Total:</span>
              <span>{calculateInvoiceTotals().total.toLocaleString()} DA</span>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={invoiceData.notes}
          onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
          placeholder="Additional notes..."
        />
      </div>
    </div>
  );

  // Print preview component
  const PrintComponent = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const { isPrinting } = useReactToPrint({
      content: () => componentRef.current,
      onBeforePrint: () => {
        console.log("Preparing to print...");
      },
      onAfterPrint: () => {
        console.log("Print completed or canceled.");
      },
    });

    const selectedCustomerData = mockCustomers.find(c => c.id === selectedCustomer);
    const { subtotal, taxTotal, total } = calculateInvoiceTotals();
    
    return (
      <div ref={componentRef} className="p-6 max-w-4xl mx-auto bg-white">
        <style type="text/css" media="print">
          {`
            @page { size: auto; margin: 10mm; }
            body { margin: 0; padding: 0; }
            .print-only { display: block !important; }
          `}
        </style>
        
        <div className="flex justify-between items-start pb-8 border-b">
          <div>
            <h1 className="text-3xl font-bold text-black">Faktura DZ</h1>
            <p className="text-sm text-gray-600 mt-1">Smart Invoicing Solution</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-black">{invoiceData.number}</h2>
            <p className="text-sm text-gray-600 mt-1">Date: {new Date(invoiceData.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Due Date: {new Date(invoiceData.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 my-8">
          <div>
            <h3 className="font-bold text-gray-700 mb-2">From:</h3>
            <p className="text-black">Your Company Name</p>
            <p className="text-gray-600">123 Business Street</p>
            <p className="text-gray-600">Algiers, Algeria</p>
            <p className="text-gray-600">contact@yourcompany.dz</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-2">To:</h3>
            <p className="text-black">{selectedCustomerData?.name || "Customer Name"}</p>
            <p className="text-gray-600">Customer Address</p>
            <p className="text-gray-600">Customer City, Algeria</p>
            <p className="text-gray-600">customer@email.com</p>
          </div>
        </div>
        
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-right">Quantity</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map(item => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 text-left">{item.name}</td>
                <td className="py-3 text-left">{item.description}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">{item.unitPrice.toLocaleString()} DA</td>
                <td className="py-3 text-right">{item.total.toLocaleString()} DA</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between py-2">
              <span className="font-medium">Subtotal:</span>
              <span>{subtotal.toLocaleString()} DA</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Tax:</span>
              <span>{taxTotal.toLocaleString()} DA</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold border-t border-gray-300">
              <span>Total:</span>
              <span>{total.toLocaleString()} DA</span>
            </div>
          </div>
        </div>
        
        {invoiceData.notes && (
          <div className="mt-8 pt-4 border-t border-gray-300">
            <h3 className="font-bold text-gray-700 mb-2">Notes:</h3>
            <p className="text-gray-600">{invoiceData.notes}</p>
          </div>
        )}
        
        <div className="mt-12 pt-8 border-t border-gray-300 text-center text-gray-500 text-sm">
          <p>Thank you for your business</p>
          <p>Faktura DZ © {new Date().getFullYear()}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">الفواتير</h1>
        <Button onClick={handleCreateInvoice} className="bg-faktura-blue hover:bg-faktura-dark-blue">
          <Plus className="mr-2 h-4 w-4" /> إنشاء فاتورة جديدة
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>جميع الفواتير</CardTitle>
          <CardDescription>إدارة وتتبع جميع سجلات الفواتير الخاصة بك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الفواتير..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="sent">مرسلة</SelectItem>
                <SelectItem value="paid">مدفوعة</SelectItem>
                <SelectItem value="overdue">متأخرة</SelectItem>
                <SelectItem value="cancelled">ملغاة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-right font-medium">الفاتورة</th>
                  <th className="pb-2 text-right font-medium">العميل</th>
                  <th className="pb-2 text-right font-medium">المبلغ</th>
                  <th className="pb-2 text-right font-medium">التاريخ</th>
                  <th className="pb-2 text-right font-medium">تاريخ الاستحقاق</th>
                  <th className="pb-2 text-right font-medium">الحالة</th>
                  <th className="pb-2 text-right font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b last:border-0">
                    <td className="py-3 flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      {invoice.number}
                    </td>
                    <td className="py-3 text-right">{invoice.customerName}</td>
                    <td className="py-3 text-right">{invoice.total.toLocaleString()} DA</td>
                    <td className="py-3 text-right">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="py-3 text-right">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[invoice.status]}`}>
                        {invoice.status === 'draft' && 'مسودة'}
                        {invoice.status === 'sent' && 'مرسلة'}
                        {invoice.status === 'paid' && 'مدفوعة'}
                        {invoice.status === 'overdue' && 'متأخرة'}
                        {invoice.status === 'cancelled' && 'ملغاة'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownloadInvoice(invoice)}
                          title="تنزيل PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="طباعة الفاتورة"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      لم يتم العثور على فواتير مطابقة لعوامل التصفية الخاصة بك.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Invoice Creation Modal - Responsive handling with Dialog for desktop and Sheet for mobile */}
      {isMobile ? (
        <Sheet open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <SheetContent className="w-full sm:max-w-full overflow-y-auto">
            <SheetHeader>
              <SheetTitle>إنشاء فاتورة جديدة</SheetTitle>
              <SheetDescription>أنشئ فاتورة جديدة وأضف عناصر إليها.</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <InvoiceForm />
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={closeCreateModal}>إلغاء</Button>
              <Button onClick={handleSaveInvoice}>حفظ الفاتورة</Button>
              <Button variant="outline" onClick={handlePrint}>معاينة وطباعة</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إنشاء فاتورة جديدة</DialogTitle>
              <DialogDescription>أنشئ فاتورة جديدة وأضف عناصر إليها.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <InvoiceForm />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeCreateModal}>إلغاء</Button>
              <Button onClick={handleSaveInvoice}>حفظ الفاتورة</Button>
              <Button variant="outline" onClick={handlePrint}>معاينة وطباعة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Hidden Print Component */}
      <div className="hidden">
        <PrintComponent />
      </div>
    </div>
  );
};

export default Invoices;
