import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import Index from "./pages/Index";
import AccountPage from "./pages/AccountPage";
import SocialProfilePage from "./pages/SocialProfilePage";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import Brands from "./pages/Brands";
import BrandPage from "./pages/BrandPage";
import Stores from "./pages/Stores";
import VendorPage from "./pages/VendorPage";
import Deals from "./pages/Deals";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminAdsPage from "./pages/admin/AdminAdsPage";
import AdminWalletsPage from "./pages/admin/AdminWalletsPage";
import TranslationManagementPage from "./pages/admin/TranslationManagementPage";
import WalletPage from "./pages/WalletPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
          <Route index element={<Index />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="/cat/:mainCatSlug" element={<CategoryPage />} />
          <Route path="/cat/:mainCatSlug/:subCatSlug" element={<CategoryPage />} />
          <Route path="/cat/:mainCatSlug/:subCatSlug/:subSubCatSlug" element={<CategoryPage />} />
          <Route path="/cat/:mainCatSlug/:subCatSlug/:extraSubSubCatSlug" element={<CategoryPage />} />
          <Route path="/item/:productId/:productSlug" element={<ProductDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="category/:categorySlug" element={<Categories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="/b/:brandId/:brandName" element={<BrandPage />} />
          <Route path="m" element={<Stores />} />
          <Route path="m/:vendorId/:vendorName" element={<VendorPage />} />
          <Route path="deals" element={<Deals />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="profile" element={<SocialProfilePage />} />
          <Route path="profile/:username" element={<SocialProfilePage />} />
          <Route path="friends" element={<SocialProfilePage />} />
          <Route path="photos" element={<SocialProfilePage />} />
          <Route path="messages" element={<SocialProfilePage />} />
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
          <Route path="translations" element={<TranslationManagementPage />} />
        </Route>
      </Routes>
    </LanguageProvider>
  );
}

export default App;
