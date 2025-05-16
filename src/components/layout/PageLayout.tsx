
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { ReactNode, useEffect } from "react";
import { useDeviceDetect } from "@/hooks/use-mobile";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { deviceType } = useDeviceDetect();
  
  // Add print-specific meta viewport for better print handling
  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      const newMetaViewport = document.createElement('meta');
      newMetaViewport.name = 'viewport';
      newMetaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(newMetaViewport);
    }
    
    // Add print-specific meta tag
    const printMeta = document.createElement('meta');
    printMeta.name = 'print-viewport';
    printMeta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(printMeta);
    
    // Add print stylesheet
    const printStyle = document.createElement('style');
    printStyle.media = 'print';
    printStyle.textContent = `
      @page { size: auto; margin: 10mm; }
      @media print {
        body * { visibility: hidden; }
        .print-container, .print-container * { visibility: visible; }
        .print-container { position: absolute; left: 0; top: 0; width: 100%; }
        header, nav, footer, .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(printStyle);
    
    return () => {
      document.head.removeChild(printMeta);
      document.head.removeChild(printStyle);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col md:flex-row">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
