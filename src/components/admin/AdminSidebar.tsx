
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  LayoutGrid, 
  Users, 
  ShoppingBag, 
  Settings, 
  Store, 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const AdminSidebar = () => {
  const { logout } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: LayoutGrid, label: "Κατηγορίες", path: "/admin/categories" },
    { icon: Package, label: "Προϊόντα", path: "/admin/products" },
    { icon: Store, label: "Καταστήματα", path: "/admin/stores" },
    { icon: ShoppingBag, label: "Παραγγελίες", path: "/admin/orders" },
    { icon: Users, label: "Χρήστες", path: "/admin/users" },
    { icon: Settings, label: "Ρυθμίσεις", path: "/admin/settings" },
  ];
  
  return (
    <div className="border-r h-full w-64 p-4 flex flex-col">
      <div className="flex items-center py-4">
        <h2 className="text-xl font-bold">BestPrice Admin</h2>
      </div>
      
      <Separator className="my-4" />
      
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-md text-sm
              ${isActive 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted"}
            `}
            end={item.path === "/admin"}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <Separator className="my-4" />
      
      <Button 
        variant="ghost" 
        className="justify-start text-muted-foreground"
        onClick={logout}
      >
        <LogOut className="h-4 w-4 mr-3" />
        <span>Αποσύνδεση</span>
      </Button>
    </div>
  );
};

export default AdminSidebar;
