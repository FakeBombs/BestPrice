
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/categories" element={<MainLayout><Categories /></MainLayout>} />
          <Route path="/categories/:categoryId" element={<MainLayout><Categories /></MainLayout>} />
          <Route path="/product/:productId" element={<MainLayout><ProductDetail /></MainLayout>} />
          <Route path="/search" element={<MainLayout><SearchResults /></MainLayout>} />
          <Route path="/deals" element={<MainLayout><Deals /></MainLayout>} />
          <Route path="/stores" element={<MainLayout><Stores /></MainLayout>} />
          <Route path="/brands" element={<MainLayout><Brands /></MainLayout>} />
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
