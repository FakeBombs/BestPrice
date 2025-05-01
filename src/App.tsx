
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import MainLayout from './layouts/MainLayout'
import Index from './pages/Index'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProductDetail from './pages/ProductDetail'
import AccountPage from './pages/AccountPage'
import SearchResults from './pages/SearchResults'
import NotFound from './pages/NotFound'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminAdsPage from './pages/admin/AdminAdsPage'
import Categories from './pages/Categories'
import CategoryPage from './pages/CategoryPage'
import AdminWalletsPage from './pages/admin/AdminWalletsPage'
import TranslationManagementPage from './pages/admin/TranslationManagementPage'
import Brands from './pages/Brands'
import BrandPage from './pages/BrandPage'
import Stores from './pages/Stores'
import VendorPage from './pages/VendorPage'
import Deals from './pages/Deals'
import SocialProfilePage from './pages/SocialProfilePage'
import WalletPage from './pages/WalletPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="product/:id/:slug" element={<ProductDetail />} />
          <Route path="account/*" element={<AccountPage />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="categories" element={<Categories />} />
          <Route path="cat/:id/:slug" element={<CategoryPage />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brand/:id/:name" element={<BrandPage />} />
          <Route path="stores" element={<Stores />} />
          <Route path="store/:id/:name" element={<VendorPage />} />
          <Route path="deals" element={<Deals />} />
          <Route path="profile/:username" element={<SocialProfilePage />} />
          <Route path="wallet/*" element={<WalletPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="ads" element={<AdminAdsPage />} />
          <Route path="wallets" element={<AdminWalletsPage />} />
          <Route path="translations" element={<TranslationManagementPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
