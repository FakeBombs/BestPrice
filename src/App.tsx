
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import AccountPage from "./pages/AccountPage";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import Stores from "./pages/Stores";
import Deals from "./pages/Deals";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminAdsPage from "./pages/admin/AdminAdsPage";
import AdminWalletsPage from "./pages/admin/AdminWalletsPage";
import WalletPage from "./pages/WalletPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="item/:productId/:productSlug?.html" element={<ProductDetail />} />
          <Route path="item/:productId" element={<ProductDetail />} />
          <Route path="category/:categorySlug" element={<Categories />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:rootCategoryId" element={<Categories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="stores" element={<Stores />} />
          <Route path="deals" element={<Deals />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="wallet/:tab" element={<WalletPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="ads" element={<AdminAdsPage />} />
          <Route path="wallets" element={<AdminWalletsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
