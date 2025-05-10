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
  onMouseEnterCategory?: (id: number | null) => void;
}

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ onSitemapToggle, onRemoveSitemap, isSitemapVisible /*, onMouseEnterCategory */ }, ref) => {
    const { t, language } = useTranslation();

    // Prepare style for the sitemap button's pseudo-element
    const translatedCategoriesText = t('categories', 'Categories');
    const sitemapButtonStyle = { '--translated-content': `"${translatedCategoriesText}"` };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Handle click events to close sitemap on navbar clicks (except the sitemap toggle button)
    const handleNavbarClick = (event: React.MouseEvent<HTMLDivElement>) => {
      // Check if the click originated ON or INSIDE the sitemap button
      const target = event.target as Element;
      if (!target.closest('#sitemap-toggle')) {
         // Also close the mobile menu if open and clicking outside relevant areas
         if (isMenuOpen && !target.closest('#mobile-menu-content')) { // Assuming mobile menu has an ID
            setIsMenuOpen(false);
         }
         onRemoveSitemap(); // Close the main sitemap
      }
    };

    const toggleMobileMenu = () => setIsMenuOpen(!isMenuOpen);

    // Prevent sitemap close when clicking elements that shouldn't close it
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    // Use onMouseDown for outer wrapper to potentially catch clicks before children process them? Or keep onClick.
    <div className="bp-header__outer-wrapper" onClick={handleNavbarClick} ref={ref}>
      <header id="bp-header" className="bp-header root__wrapper">
        <div className="root" id="header-root">
          <div id="nav">
            {/* Stop propagation on logo click if it shouldn't close sitemap */}
            <h1 className="logo__wrapper" onClick={stopPropagation}>
              <Link to="/" id="back-to-home" className="pressable" tabIndex={-1}>
                 <svg aria-hidden="true" className="icon" width="100%" height="100%"><use href="/dist/images/icons/logo.svg#icon-logo"></use></svg>
                 {/* Screen reader text or use aria-label on link */}
                 <span>{t('site_name', 'BestPrice')}</span>
              </Link>
            </h1>
          </div>

          {/* User section might also need stopPropagation depending on desired behavior */}
          <div id="user" onClick={stopPropagation}>
            {/* Desktop Navigation */}
            <nav className="md:flex items-center space-x-4">
              <NotificationButton />
              <UserButton />
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div className="search__wrapper">
             {/* Sitemap Button */}
            <div
               className="sitemap-button sitemap-button--desktop pressable"
               aria-label={t('sitemap_button_label', 'Sitemap button')}
               role="button"
               id="sitemap-toggle"
               onClick={(e) => { e.stopPropagation(); onSitemapToggle(); }} // Stop propagation here is important
               style={sitemapButtonStyle} // Apply style for pseudo-element
             >
              <div className="sitemap-button__lines">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>

            {/* Desktop Search - Stop propagation if needed */}
            <SearchBar onClick={stopPropagation} />
          </div>

        </div>

        {/* Mobile Menu */}
        {/* Add an ID here for easier click handling */}
        {isMenuOpen && (
          <div id="mobile-menu-content" className="md:hidden border-t p-4">
            {/* Search bar inside mobile should probably not close the menu */}
            <SearchBar className="mb-4" onClick={stopPropagation}/>
            <nav className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                 {/* Link should likely close the mobile menu */}
                <Link to="/account" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                    {t('my_account_link', 'My Account')}
                </Link>
              </div>
              {/* Add other mobile links here */}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
});

Navbar.displayName = 'Navbar'; // Required for forwardRef

export default Navbar;
