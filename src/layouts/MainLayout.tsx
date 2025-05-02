import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import Footer from '@/components/Footer';
import { mainCategories, vendors, products } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Moon, Sun } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // On mount, read the preferred theme from the localStorage
    const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setIsDarkMode(storedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const generateSitemapLinks = () => {
    // Create category links
    const categoryLinks = mainCategories.map(category => ({
      id: category.id,
      title: category.name,
      url: `/cat/${category.id}/${category.slug}`
    }));
    
    // Create brand links (using a subset for demonstration)
    const brandLinks = vendors
      .filter(vendor => vendor.certification)
      .map(vendor => ({
        id: vendor.id,
        title: vendor.name,
        url: `/m/${vendor.id}/${vendor.name.toLowerCase().replace(/\s+/g, '-')}`
      }));

    // Sample products (would typically come from an API)
    const productLinks = products
      .slice(0, 5) // Just take first 5 for example
      .map(product => ({
        id: product.id,
        title: product.name,
        url: `/item/${product.id}/${product.slug || 'product'}`
      }));

    return [
      {
        title: "Main Pages",
        links: [
          { id: "home", title: "Home", url: "/" },
          { id: "categories", title: "Categories", url: "/categories" },
          { id: "deals", title: "Deals", url: "/deals" },
          { id: "vendors", title: "Stores", url: "/stores" },
        ]
      },
      {
        title: "Top Categories",
        links: categoryLinks
      },
      {
        title: "Featured Stores",
        links: brandLinks
      },
      {
        title: "Popular Products",
        links: productLinks
      }
    ];
  };

  const sitemapLinks = generateSitemapLinks();

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">BestPrice</Link>
          <SearchBar />
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="dark-mode-toggle">
              {isDarkMode ? <Sun className="h-5 w-5 text-gray-500" /> : <Moon className="h-5 w-5 text-gray-500" />}
            </button>
            {user ? (
              <>
                <span>{user.email}</span>
                <button onClick={logout} className="text-blue-500 hover:underline">
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-500 hover:underline">
                  {t('login')}
                </Link>
                <Link to="/register" className="text-green-500 hover:underline">
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="container mx-auto px-4 py-8">
          <div className="sitemap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sitemapLinks.map((section, sectionIndex) => (
              <div key={`section-${sectionIndex}`} className="sitemap__section">
                <h3 className="sitemap__title">{section.title}</h3>
                <ul className="sitemap__links">
                  {section.links.map((link) => {
                    // Convert id to string for comparison if needed
                    const linkId = String(link.id);
                    
                    return (
                      <li key={linkId} className="sitemap__link-wrapper">
                        <Link to={link.url} className="sitemap__link">
                          {link.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
