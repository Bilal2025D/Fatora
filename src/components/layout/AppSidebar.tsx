
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FileText, Home, BarChart, Package, Search, Settings, CreditCard, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/",
    },
    {
      title: "Invoices",
      icon: FileText,
      path: "/invoices",
    },
    {
      title: "Products",
      icon: Package,
      path: "/products",
    },
    {
      title: "Customers",
      icon: Users,
      path: "/customers",
    },
    {
      title: "Payments",
      icon: CreditCard,
      path: "/payments",
    },
    {
      title: "Reports",
      icon: BarChart,
      path: "/reports",
    },
  ];

  const settingsMenuItems = [
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-faktura-dark-blue text-white">
            F
          </div>
          <div className="font-semibold text-lg">Faktura DZ</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.path} className={isActive(item.path) ? "bg-accent" : ""}>
                  <SidebarMenuButton onClick={() => navigate(item.path)}>
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Search className="h-4 w-4 mr-3" />
                  <span>Help</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {settingsMenuItems.map((item) => (
                <SidebarMenuItem key={item.path} className={isActive(item.path) ? "bg-accent" : ""}>
                  <SidebarMenuButton onClick={() => navigate(item.path)}>
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
