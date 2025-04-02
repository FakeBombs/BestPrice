import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import UserButton from '@/components/UserButton';
import NotificationButton from '@/components/NotificationButton';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <div className="bp-header__outer-wrapper">
    <header id="bp-header" className="bp-header root__wrapper">
      <div className="root" id="header-root">
        <div id="nav">
          <h1 class="logo__wrapper">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">BestPrice</span>
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

        <div class="search__wrapper">
          {/* Desktop Search */}
          <div className="md:flex flex-1 mx-8">
            <SearchBar className="flex-1" />
          </div>
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
