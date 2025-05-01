
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import useSupabaseAuth from '@/hooks/useSupabaseAuth';

const AdminLayout = () => {
  const { user, isAdmin, loading } = useSupabaseAuth();
  
  // Show loading state if authentication is being checked
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated or not an admin
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
