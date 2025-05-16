
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { salesData, categoryData, invoices, products, customers } from "@/data/mockData";
import { BarChart, PieChart, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, LineChart, Line } from "recharts";
import { Download } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Reports = () => {
  const [period, setPeriod] = useState("monthly");
  
  const generateMonthlyData = () => {
    return salesData.map(item => ({
      name: item.date,
      value: item.amount
    }));
  };
  
  const generateCategoryData = () => {
    return categoryData;
  };
  
  const generateCustomerData = () => {
    // Create customer spending data
    const customerSpending = customers.map(customer => {
      const customerInvoices = invoices.filter(invoice => invoice.customerId === customer.id);
      const totalSpent = customerInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
      
      return {
        name: customer.name,
        value: totalSpent
      };
    }).sort((a, b) => b.value - a.value);
    
    return customerSpending;
  };
  
  const generateProductData = () => {
    // Create product popularity data based on invoice items
    const productSales = products.map(product => {
      let quantitySold = 0;
      let revenue = 0;
      
      invoices.forEach(invoice => {
        const item = invoice.items.find(item => item.productId === product.id);
        if (item) {
          quantitySold += item.quantity;
          revenue += item.total;
        }
      });
      
      return {
        name: product.name,
        quantity: quantitySold,
        revenue: revenue
      };
    }).sort((a, b) => b.quantity - a.quantity);
    
    return productSales;
  };
  
  const handleExportReport = (reportType: string) => {
    alert(`Exporting ${reportType} report... This feature will be available in the next version.`);
  };

  const monthlyData = generateMonthlyData();
  const categoryData = generateCategoryData();
  const customerData = generateCustomerData();
  const productData = generateProductData();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>
      
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </div>
              <Button variant="outline" onClick={() => handleExportReport("sales")}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString()} DA`, "Sales"]} 
                    labelFormatter={(label) => {
                      const months = ["January", "February", "March", "April", "May"];
                      const [year, month] = label.split("-");
                      return `${months[parseInt(month) - 1]} ${year}`;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#3282B8" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Sales</div>
                    <div className="text-2xl font-bold mt-2">
                      {monthlyData.reduce((sum, item) => sum + item.value, 0).toLocaleString()} DA
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Average Monthly</div>
                    <div className="text-2xl font-bold mt-2">
                      {Math.round(monthlyData.reduce((sum, item) => sum + item.value, 0) / monthlyData.length).toLocaleString()} DA
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Invoices Issued</div>
                    <div className="text-2xl font-bold mt-2">{invoices.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Payment Rate</div>
                    <div className="text-2xl font-bold mt-2">
                      {Math.round((invoices.filter(inv => inv.status === 'paid').length / invoices.length) * 100)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Sales by product</CardDescription>
              </div>
              <Button variant="outline" onClick={() => handleExportReport("products")}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={productData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value: number) => [`${value}`, "Units"]} />
                  <Legend />
                  <Bar dataKey="quantity" fill="#3282B8" name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Product Revenue</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={productData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} DA`, "Revenue"]} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#0F4C75" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Analysis</CardTitle>
                <CardDescription>Revenue by customer</CardDescription>
              </div>
              <Button variant="outline" onClick={() => handleExportReport("customers")}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={customerData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value.toLocaleString()} DA`, "Revenue"]} />
                  <Legend />
                  <Bar dataKey="value" fill="#3282B8" name="Total Spent" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Customer Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={customerData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {customerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value.toLocaleString()} DA`, "Revenue"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 text-left font-medium">Customer</th>
                          <th className="pb-2 text-right font-medium">Revenue</th>
                          <th className="pb-2 text-right font-medium">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerData.map((customer, index) => {
                          const total = customerData.reduce((sum, c) => sum + c.value, 0);
                          const percentage = (customer.value / total * 100).toFixed(1);
                          
                          return (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-2">{customer.name}</td>
                              <td className="py-2 text-right">{customer.value.toLocaleString()} DA</td>
                              <td className="py-2 text-right">{percentage}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Sales by product category</CardDescription>
              </div>
              <Button variant="outline" onClick={() => handleExportReport("categories")}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={categoryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                      <Bar dataKey="value" fill="#3282B8" name="Percentage" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Category Details</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left font-medium">Category</th>
                      <th className="pb-2 text-right font-medium">Percentage</th>
                      <th className="pb-2 text-right font-medium">Products</th>
                      <th className="pb-2 text-right font-medium">Avg. Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((category, index) => {
                      const categoryProducts = products.filter(p => p.category === category.name);
                      const avgPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0) / Math.max(1, categoryProducts.length);
                      
                      return (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                              {category.name}
                            </div>
                          </td>
                          <td className="py-3 text-right">{category.value}%</td>
                          <td className="py-3 text-right">{categoryProducts.length}</td>
                          <td className="py-3 text-right">{avgPrice.toLocaleString()} DA</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
