import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { products } from "@/data/mockData";
import { Product } from "@/types";
import { Edit, PackagePlus, Plus, Search, Trash } from "lucide-react";
import { useReactToPrint } from 'react-to-print';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productList, setProductList] = useState<Product[]>(products);
  
  const filteredProducts = productList.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateProduct = () => {
    alert("Creating new product... This feature will be available in the next version.");
  };
  
  const handleEditProduct = (product: Product) => {
    alert(`Editing product ${product.name}... This feature will be available in the next version.`);
  };
  
  const handleDeleteProduct = (product: Product) => {
    alert(`Deleting product ${product.name}... This feature will be available in the next version.`);
  };
  
  const componentRef = useRef<HTMLDivElement>(null);
  const { isPrinting } = useReactToPrint({
    documentTitle: "Products List",
    onBeforePrint: () => {
      console.log("Preparing to print products...");
    },
    onAfterPrint: () => {
      console.log("Products print completed");
    },
    // تصحيح طريقة استخدام المرجع للمحتوى المراد طباعته
    contentRef: componentRef
  });

  // تصحيح خصائص عنصر style
  return (
    <>
      <style type="text/css">
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-section, .print-section * {
              visibility: visible;
            }
            .print-section {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateProduct} className="bg-faktura-blue hover:bg-faktura-dark-blue">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
            <Button onClick={isPrinting} className="bg-faktura-blue hover:bg-faktura-dark-blue">
              Print
            </Button>
          </div>
        </div>
        
        <Card className="print-section">
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6 no-print">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full" ref={componentRef}>
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Name</th>
                    <th className="pb-2 text-left font-medium">Description</th>
                    <th className="pb-2 text-left font-medium">Category</th>
                    <th className="pb-2 text-left font-medium">Price</th>
                    <th className="pb-2 text-left font-medium">Stock</th>
                    <th className="pb-2 text-right font-medium no-print">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b last:border-0">
                      <td className="py-3">{product.name}</td>
                      <td className="py-3 max-w-[200px] truncate">{product.description}</td>
                      <td className="py-3">{product.category}</td>
                      <td className="py-3">${product.price.toFixed(2)}</td>
                      <td className="py-3">{product.stock}</td>
                      <td className="py-3 text-right no-print">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditProduct(product)}
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteProduct(product)}
                            title="Delete Product"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted-foreground">
                        No products found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductsPage;
