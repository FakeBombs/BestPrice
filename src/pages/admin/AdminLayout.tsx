
import React, { ReactNode, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is an admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/account");
    }
  }, [user, navigate]);
  
  if (!user || !user.isAdmin) {
    return null; // Will redirect via the useEffect
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
