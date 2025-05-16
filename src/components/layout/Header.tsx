
import { Bell, FileText, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  const getPageTitle = () => {
    if (pathSegments.length === 0) return "Dashboard";
    if (pathSegments[0] === "invoices") return "Invoices";
    if (pathSegments[0] === "products") return "Products";
    if (pathSegments[0] === "customers") return "Customers";
    if (pathSegments[0] === "reports") return "Reports";
    return pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1);
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <SidebarTrigger className="md:hidden">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
          <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" /> Invoices
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
