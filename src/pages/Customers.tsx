
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customers } from "@/data/mockData";
import { Customer } from "@/types";
import { Edit, Mail, Phone, Plus, Search, Trash, User, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";

// تحديد مخطط بيانات العميل باستخدام zod
const customerSchema = z.object({
  name: z.string().min(1, { message: "الاسم مطلوب" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  phone: z.string().min(1, { message: "رقم الهاتف مطلوب" }),
  address: z.string().min(1, { message: "العنوان مطلوب" }),
  taxId: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customersList, setCustomersList] = useState<Customer[]>(customers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const filteredCustomers = customersList.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      taxId: "",
    }
  });

  const handleCreateCustomer = () => {
    form.reset();
    setIsAddDialogOpen(true);
  };
  
  const handleEditCustomer = (customer: Customer) => {
    form.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      taxId: customer.taxId || "",
    });
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const onSubmitAdd = (data: CustomerFormValues) => {
    const newCustomer: Customer = {
      id: `cust_${Math.floor(Math.random() * 10000)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      taxId: data.taxId,
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
    };
    
    setCustomersList([...customersList, newCustomer]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "تم إضافة العميل بنجاح",
      description: `تمت إضافة ${data.name} إلى قائمة العملاء.`,
    });
  };

  const onSubmitEdit = (data: CustomerFormValues) => {
    if (!selectedCustomer) return;
    
    const updatedCustomers = customersList.map(customer => {
      if (customer.id === selectedCustomer.id) {
        return {
          ...customer,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          taxId: data.taxId,
        };
      }
      return customer;
    });
    
    setCustomersList(updatedCustomers);
    setIsEditDialogOpen(false);
    
    toast({
      title: "تم تحديث بيانات العميل",
      description: `تم تحديث بيانات ${data.name} بنجاح.`,
    });
  };

  const onConfirmDelete = () => {
    if (!selectedCustomer) return;
    
    const updatedCustomers = customersList.filter(
      customer => customer.id !== selectedCustomer.id
    );
    
    setCustomersList(updatedCustomers);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "تم حذف العميل",
      description: `تم حذف ${selectedCustomer.name} من قائمة العملاء.`,
    });
  };

  const CustomerForm = ({ isEdit = false, onSubmit }: { isEdit?: boolean, onSubmit: (data: CustomerFormValues) => void }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم العميل</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم العميل" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <Input placeholder="أدخل رقم الهاتف" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العنوان</FormLabel>
              <FormControl>
                <Input placeholder="أدخل عنوان العميل" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرقم الضريبي (اختياري)</FormLabel>
              <FormControl>
                <Input placeholder="أدخل الرقم الضريبي" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => isEdit ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false)}
          >
            إلغاء
          </Button>
          <Button type="submit" className="bg-faktura-blue hover:bg-faktura-dark-blue">
            {isEdit ? 'تحديث العميل' : 'إضافة العميل'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  // استخدام النافذة المنبثقة على الأجهزة المكتبية والمنزلقة على الجوال
  const AddCustomerDialog = () => {
    if (isMobile) {
      return (
        <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader className="rtl:text-right">
              <SheetTitle>إضافة عميل جديد</SheetTitle>
              <SheetDescription>أدخل بيانات العميل الجديد</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <CustomerForm onSubmit={onSubmitAdd} />
            </div>
          </SheetContent>
        </Sheet>
      );
    }
    
    return (
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
            <DialogDescription>أدخل بيانات العميل الجديد</DialogDescription>
          </DialogHeader>
          <CustomerForm onSubmit={onSubmitAdd} />
        </DialogContent>
      </Dialog>
    );
  };

  const EditCustomerDialog = () => {
    if (isMobile) {
      return (
        <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader className="rtl:text-right">
              <SheetTitle>تعديل بيانات العميل</SheetTitle>
              <SheetDescription>قم بتحديث بيانات العميل</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <CustomerForm isEdit onSubmit={onSubmitEdit} />
            </div>
          </SheetContent>
        </Sheet>
      );
    }
    
    return (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل بيانات العميل</DialogTitle>
            <DialogDescription>قم بتحديث بيانات العميل</DialogDescription>
          </DialogHeader>
          <CustomerForm isEdit onSubmit={onSubmitEdit} />
        </DialogContent>
      </Dialog>
    );
  };

  const DeleteConfirmationDialog = () => (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تأكيد حذف العميل</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من أنك تريد حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            إلغاء
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete}
          >
            نعم، احذف العميل
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">العملاء</h1>
        <Button onClick={handleCreateCustomer} className="bg-faktura-blue hover:bg-faktura-dark-blue">
          <UserPlus className="mr-2 h-4 w-4" /> إضافة عميل
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>جميع العملاء</CardTitle>
          <CardDescription>إدارة قاعدة بيانات العملاء</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-2.5" />
            <Input
              placeholder="البحث عن عملاء..."
              className="pl-8 rtl:pl-4 rtl:pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium rtl:text-right">الاسم</th>
                  <th className="pb-2 text-left font-medium rtl:text-right">البريد الإلكتروني</th>
                  <th className="pb-2 text-left font-medium rtl:text-right">الهاتف</th>
                  <th className="pb-2 text-left font-medium rtl:text-right">العنوان</th>
                  <th className="pb-2 text-left font-medium rtl:text-right">الرقم الضريبي</th>
                  <th className="pb-2 text-right font-medium rtl:text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-0">
                    <td className="py-3 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-faktura-blue text-white flex items-center justify-center mr-2 rtl:ml-2 rtl:mr-0">
                        <User className="h-4 w-4" />
                      </div>
                      {customer.name}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground rtl:ml-2 rtl:mr-0" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground rtl:ml-2 rtl:mr-0" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="py-3 max-w-[200px] truncate">{customer.address}</td>
                    <td className="py-3">{customer.taxId || "-"}</td>
                    <td className="py-3 text-right rtl:text-left">
                      <div className="flex justify-end gap-2 rtl:justify-start">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditCustomer(customer)}
                          title="تعديل العميل"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteCustomer(customer)}
                          title="حذف العميل"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                      لا يوجد عملاء مطابقين لعملية البحث.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <AddCustomerDialog />
      <EditCustomerDialog />
      <DeleteConfirmationDialog />
    </div>
  );
};

export default Customers;
