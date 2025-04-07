
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import UserButton from '@/components/UserButton';
import NotificationButton from '@/components/NotificationButton';
import { useTranslation } from '@/hooks/useTranslation';

const Navbar = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <div className="bp-header__outer-wrapper">
    <header id="bp-header" className="bp-header root__wrapper">
      <div className="root" id="header-root">
        <div id="nav">
          <h1 className="logo__wrapper">
          {/* Logo */}
          <Link to="/" id="back-to-home" className="pressable" tabIndex={-1}>
            <span>BestPrice</span>
          </Link>
          </h1>
        </div>

        <div id="user">
          {/* Desktop Navigation */}
          <nav className="md:flex items-center space-x-4">
            <ThemeToggle />
            <NotificationButton />
            <UserButton />
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <div className="search__wrapper">
          <div aria-label="Sitemap button" role="button" className="sitemap-button sitemap-button--desktop pressable">
            <div className="sitemap-button__lines">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>

          {/* Desktop Search */}
          <SearchBar />
        </div>
        
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden border-t p-4">
          <SearchBar className="mb-4" />
          <nav className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <Link to="/account" className="text-sm font-medium">
                My Account
              </Link>
              <ThemeToggle />
            </div>
          </nav>
        </div>}
  </header>
    </div>;
};
export default Navbar;
