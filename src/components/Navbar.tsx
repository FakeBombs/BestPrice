import React, { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import UserButton from '@/components/UserButton';
import NotificationButton from '@/components/NotificationButton';
import { useTranslation } from '@/hooks/useTranslation';

interface NavbarProps {
  onSitemapToggle: () => void;
  onRemoveSitemap: () => void;
  isSitemapVisible: boolean;
  onMouseEnter: (id: number) => void; // New prop for mouse enter functionality
}

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ onSitemapToggle, onRemoveSitemap, isSitemapVisible, onMouseEnter }, ref) => {
    const { t } = useTranslation();
    const { t, language } = useTranslation();
    const translatedText = t('categories', 'Κατηγορίες');
    const style = { '--translated-content': `"${translatedText}"` };
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Handle click events to close sitemap on navbar clicks (except the sitemap button)
    const handleNavbarClick = (event: React.MouseEvent) => {
      // Prevent closing if clicking on the sitemap toggle button
      if (event.currentTarget.id !== 'sitemap-toggle') {
        onRemoveSitemap();
      }
    };

  return (
    <div className="bp-header__outer-wrapper" onClick={handleNavbarClick} ref={ref}>
      <header id="bp-header" className="bp-header root__wrapper">
        <div className="root" id="header-root">
          <div id="nav">
            <h1 className="logo__wrapper" onClick={handleNavbarClick}>
              <Link to="/" id="back-to-home" className="pressable" tabIndex={-1}><svg aria-hidden="true" className="icon" width="100%" height="100%"><use href="/dist/images/icons/logo.svg#icon-logo"></use></svg><span>BestPrice</span></Link>
            </h1>
          </div>

          <div id="user" onClick={handleNavbarClick}>
            {/* Desktop Navigation */}
            <nav className="md:flex items-center space-x-4">
              <NotificationButton />
              <UserButton />
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div className="search__wrapper">
            <div className="sitemap-button sitemap-button--desktop pressable" aria-label="Sitemap button" role="button" id="sitemap-toggle" onClick={(e) => { e.stopPropagation(); onSitemapToggle(); }} style={style}>
              <div className="sitemap-button__lines">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>

            {/* Desktop Search */}
            <SearchBar onClick={handleNavbarClick} />
          </div>
          
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t p-4">
            <SearchBar className="mb-4" />
            <nav className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <Link to="/account" className="text-sm font-medium">My Account</Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
});

Navbar.displayName = 'Navbar'; // Required for forwardRef

export default Navbar;
