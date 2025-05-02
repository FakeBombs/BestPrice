
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import SearchResults from './pages/SearchResults';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import BrandPage from './pages/BrandPage';
import Categories from './pages/Categories';
import Deals from './pages/Deals';
import Stores from './pages/Stores';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminNewCategoryPage from './pages/admin/AdminNewCategoryPage';
import AdminEditCategoryPage from './pages/admin/AdminEditCategoryPage';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="cat/:categoryId/:categorySlug" element={<CategoryPage />} />
          <Route path="item/:id/:slug" element={<ProductDetail />} />
          <Route path="brand/:id/:name" element={<BrandPage />} />
          <Route path="categories" element={<Categories />} />
          <Route path="deals" element={<Deals />} />
          <Route path="stores" element={<Stores />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="categories/new" element={<AdminNewCategoryPage />} />
          <Route path="categories/edit/:categoryId" element={<AdminEditCategoryPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
