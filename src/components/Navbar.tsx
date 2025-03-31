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
  return <header className="w-full border-b bg-background bg-[#161616]">
      <div className="container flex items-center py-[1.05rem]">
        <div className="flex items-center justify-between w-full h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">BestPrice</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-8">
            <SearchBar className="flex-1" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <NotificationButton />
            <UserButton />
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
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
    </header>;
};
export default Navbar;
