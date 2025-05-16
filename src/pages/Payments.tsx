
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { payments, invoices } from "@/data/mockData";
import { Payment, Invoice } from "@/types";
import { CreditCard, Eye, Plus, Search, Download, FilterX, Calendar } from "lucide-react";
import { format } from "date-fns";

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState<string | undefined>(undefined);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment & {invoiceNumber: string, customerName: string} | null>(null);
  
  const enhancedPayments = payments.map(payment => {
    const invoice = invoices.find(inv => inv.id === payment.invoiceId);
    return {
      ...payment,
      invoiceNumber: invoice ? invoice.number : "غير معروف",
      customerName: invoice ? invoice.customerName : "غير معروف",
    };
  });
  
  const filteredPayments = enhancedPayments.filter(payment => {
    const matchesSearch = 
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.reference && payment.reference.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMethod = methodFilter && methodFilter !== "all" ? payment.method === methodFilter : true;
    
    return matchesSearch && matchesMethod;
  });
  
  const handleRecordPayment = () => {
    setIsRecordDialogOpen(true);
  };
  
  const handleViewDetails = (payment: Payment & {invoiceNumber: string, customerName: string}) => {
    setSelectedPayment(payment);
    setIsDetailsDialogOpen(true);
  };

  const handleSubmitPayment = () => {
    setIsRecordDialogOpen(false);
    toast.success("تم تسجيل الدفعة بنجاح", {
      description: "تمت إضافة الدفعة إلى السجلات"
    });
  };

  const downloadReceipt = () => {
    toast.success("جاري تحميل الإيصال", {
      description: "سيتم تنزيل الإيصال كملف PDF"
    });
    setIsDetailsDialogOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setMethodFilter(undefined);
    toast.info("تم مسح جميع الفلاتر");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">المدفوعات</h1>
        <Button onClick={handleRecordPayment} className="bg-faktura-blue hover:bg-faktura-dark-blue">
          <Plus className="mr-2 h-4 w-4" /> تسجيل دفعة
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>جميع المدفوعات</CardTitle>
          <CardDescription>تتبع جميع المدفوعات المستلمة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المدفوعات..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="تصفية حسب طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطرق</SelectItem>
                <SelectItem value="ccp">CCP</SelectItem>
                <SelectItem value="baridiMob">BaridiMob</SelectItem>
                <SelectItem value="cash">نقدا</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || methodFilter) && (
              <Button variant="outline" size="icon" onClick={clearFilters} title="مسح الفلاتر">
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الفاتورة</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>طريقة الدفع</TableHead>
                  <TableHead>المرجع</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.invoiceNumber}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">
                          {payment.method === "ccp" ? "CCP" : 
                           payment.method === "baridiMob" ? "BaridiMob" : 
                           payment.method === "cash" ? "نقدا" : "أخرى"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{payment.reference || "-"}</TableCell>
                    <TableCell className="text-right">{payment.amount.toLocaleString()} DA</TableCell>
                    <TableCell className="text-right">{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewDetails(payment)}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      لا توجد مدفوعات مطابقة للفلاتر الخاصة بك.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>تسجيل دفعة جديدة</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الدفعة أدناه ثم اضغط تسجيل.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="invoice" className="text-right col-span-1">
                الفاتورة
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر الفاتورة" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.number} - {invoice.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right col-span-1">
                المبلغ
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="paymentMethod" className="text-right col-span-1">
                طريقة الدفع
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ccp">CCP</SelectItem>
                  <SelectItem value="baridiMob">BaridiMob</SelectItem>
                  <SelectItem value="cash">نقدا</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="reference" className="text-right col-span-1">
                رقم المرجع
              </label>
              <Input
                id="reference"
                placeholder="رقم العملية أو المرجع"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right col-span-1">
                التاريخ
              </label>
              <div className="relative col-span-3">
                <Input
                  id="date"
                  type="date"
                  defaultValue={format(new Date(), "yyyy-MM-dd")}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right col-span-1">
                ملاحظات
              </label>
              <Input
                id="notes"
                placeholder="ملاحظات اختيارية"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRecordDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleSubmitPayment}>
              تسجيل الدفعة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الدفعة</DialogTitle>
            <DialogDescription>
              معلومات كاملة عن الدفعة المسجلة
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-muted-foreground">رقم الفاتورة:</div>
                <div className="col-span-2">{selectedPayment.invoiceNumber}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-muted-foreground">العميل:</div>
                <div className="col-span-2">{selectedPayment.customerName}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-muted-foreground">طريقة الدفع:</div>
                <div className="col-span-2 capitalize">
                  {selectedPayment.method === "ccp" ? "CCP" : 
                   selectedPayment.method === "baridiMob" ? "BaridiMob" : 
                   selectedPayment.method === "cash" ? "نقدا" : "أخرى"}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-muted-foreground">رقم المرجع:</div>
                <div className="col-span-2">{selectedPayment.reference || "-"}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-muted-foreground">المبلغ:</div>
                <div className="col-span-2 font-semibold">{selectedPayment.amount.toLocaleString()} DA</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-muted-foreground">التاريخ:</div>
                <div className="col-span-2">{new Date(selectedPayment.date).toLocaleDateString()}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-muted-foreground">ملاحظات:</div>
                <div className="col-span-2">{selectedPayment.notes || "-"}</div>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <Button onClick={downloadReceipt} className="w-full">
                  <Download className="mr-2 h-4 w-4" /> تحميل الإيصال
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
