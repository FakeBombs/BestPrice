
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import Index from "@/pages/Index";
import Categories from "@/pages/Categories";
import ProductDetail from "@/pages/ProductDetail";
import SearchResults from "@/pages/SearchResults";
import Deals from "@/pages/Deals";
import Stores from "@/pages/Stores";
import Brands from "@/pages/Brands";
import NotFound from "@/pages/NotFound";
import AccountPage from "@/pages/AccountPage";
import { AuthProvider } from "@/hooks/useAuth";
import { NotificationProvider } from "@/hooks/useNotifications";

// Admin Pages
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout><Index /></MainLayout>} />
              <Route path="/categories" element={<MainLayout><Categories /></MainLayout>} />
              <Route path="/cat/:categoryId/:categorySlug" element={<MainLayout><Categories /></MainLayout>} />
              <Route path="/categories/root/:rootSlug" element={<MainLayout><Categories /></MainLayout>} />
              <Route path="/item/:productId/:productSlug" element={<MainLayout><ProductDetail /></MainLayout>} />
              <Route path="/search" element={<MainLayout><SearchResults /></MainLayout>} />
              <Route path="/deals" element={<MainLayout><Deals /></MainLayout>} />
              <Route path="/stores" element={<MainLayout><Stores /></MainLayout>} />
              <Route path="/brands" element={<MainLayout><Brands /></MainLayout>} />
              <Route path="/account" element={<MainLayout><AccountPage /></MainLayout>} />
              <Route path="/account/:section" element={<MainLayout><AccountPage /></MainLayout>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="stores" element={<MainLayout><NotFound /></MainLayout>} />
                <Route path="orders" element={<MainLayout><NotFound /></MainLayout>} />
                <Route path="users" element={<MainLayout><NotFound /></MainLayout>} />
                <Route path="settings" element={<MainLayout><NotFound /></MainLayout>} />
              </Route>
              
              {/* Legacy URL support - redirects will be handled in the component */}
              <Route path="/product/:productId" element={<MainLayout><ProductDetail /></MainLayout>} />
              <Route path="/categories/:categoryId" element={<MainLayout><Categories /></MainLayout>} />
              
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
