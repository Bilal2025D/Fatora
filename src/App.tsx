
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageLayout } from "./components/layout/PageLayout";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageLayout><Dashboard /></PageLayout>} />
          <Route path="/invoices" element={<PageLayout><Invoices /></PageLayout>} />
          <Route path="/products" element={<PageLayout><Products /></PageLayout>} />
          <Route path="/customers" element={<PageLayout><Customers /></PageLayout>} />
          <Route path="/payments" element={<PageLayout><Payments /></PageLayout>} />
          <Route path="/reports" element={<PageLayout><Reports /></PageLayout>} />
          <Route path="/settings" element={<PageLayout><div className="p-8 text-center text-muted-foreground">Settings page will be available in the next version.</div></PageLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
