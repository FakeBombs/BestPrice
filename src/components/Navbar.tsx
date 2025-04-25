import React, { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import UserButton from '@/components/UserButton';
import NotificationButton from '@/components/NotificationButton';
import { useTranslation } from '@/hooks/useTranslation';

interface NavbarProps {
  onSitemapToggle: () => void; // To toggle the sitemap
  onRemoveSitemap: () => void; // To remove the sitemap class
  isSitemapVisible: boolean; // Prop to control sitemap visibility
}

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ onSitemapToggle, onRemoveSitemap, isSitemapVisible }, ref) => {
    const { t } = useTranslation();
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
              {/* Logo */}
              <Link to="/" id="back-to-home" className="pressable" tabIndex={-1}>
                <svg aria-hidden="true" className="icon logo" width="100%" height="100%" viewBox="0 0 44 28" role="img"><path fill-rule="evenodd" d="M25.016 8.96052C25.3883 8.98468 25.9053 8.91067 25.9914 9.40857C26.0751 9.8923 25.5021 10.1517 25.1015 10.2202C24.1869 10.377 23.2839 10.0922 22.4875 9.65742L22.2603 9.53529L21.5837 12.7709C22.9048 13.1744 24.5267 13.2773 25.8989 13.0421C28.2431 12.6404 30.3538 10.9752 29.9109 8.4146C29.5958 6.59385 28.2426 5.91754 26.5204 5.8318L25.5998 5.7846C25.2872 5.76493 24.7914 5.79123 24.7224 5.39303C24.6462 4.95211 25.1243 4.73833 25.4674 4.67941C26.3249 4.53251 27.1299 4.76076 27.8804 5.10075L28.4475 2.25371L28.9046 4.89594L31.0457 4.42658L32.3156 11.7668L36.2322 11.0956L34.9621 3.75537L37.1378 3.48522L36.5348 0L28.3015 1.41083L28.4316 2.16237C27.2896 1.72523 26.1166 1.60942 24.8846 1.82065C22.5403 2.22231 20.4565 4.04419 20.897 6.59038C21.1853 8.25475 22.6149 8.94727 24.2052 8.95297L25.016 8.96052ZM21.0173 10.6856L17.6011 11.271L17.419 10.2184L20.435 9.70156L19.9526 6.91345L16.9366 7.43021L16.7593 6.40596L20.0612 5.84027L19.5542 2.90984L12.3072 4.15174L14.1579 14.8482L10.4896 15.4768C12.1488 15.0332 13.6351 13.9518 13.2939 11.9798C13.0699 10.6852 12.1957 9.9709 10.9379 9.76171L10.9231 9.67638C11.829 9.21345 12.129 8.22467 11.9641 7.27169C11.5359 4.79655 9.33413 4.66126 7.23299 5.02113L2.67325 5.80255L4.52388 16.4989L0 17.2742L1.85586 28L5.62947 27.3532L5.07069 24.1242L7.07183 23.7813C9.25883 23.4065 10.3948 21.8058 10.0158 19.6152C9.59539 17.1848 7.82292 16.1729 5.6015 16.3446L9.55338 15.6672L11.4041 26.3638L15.2349 25.7074L14.6393 22.2649L17.0216 25.4011L25.3117 23.9806L23.4561 13.2549L21.5193 13.5867L21.0173 10.6856ZM6.24871 20.1288C6.3988 20.9965 5.67517 21.2378 4.98913 21.3553L4.60308 21.4213L4.28066 19.5579L4.65236 19.4943C5.29557 19.3841 6.10343 19.2896 6.24871 20.1288ZM7.01763 9.30581L6.75186 7.76949L7.46648 7.64705C7.9096 7.5711 8.35118 7.65653 8.4521 8.23976C8.58017 8.97938 7.94669 9.14657 7.37499 9.24454L7.01763 9.30581ZM8.15969 13.2698L7.71658 13.3457L7.40891 11.5676L7.79485 11.5014C8.42382 11.3937 9.42193 11.2079 9.57705 12.1042C9.7296 12.986 8.78856 13.1619 8.15969 13.2698ZM14.4727 19.6861L14.2012 19.7327L13.8862 17.9121L14.1864 17.8606C14.8725 17.743 15.4591 17.7304 15.6043 18.5697C15.742 19.3663 15.1161 19.5761 14.4727 19.6861ZM18.5913 21.5436C18.3203 21.2532 18.0645 21.1359 17.823 21.0162L17.8083 20.9308C19.1658 20.1856 19.6958 19.421 19.4128 17.7851C18.9902 15.3427 17.1354 14.5573 14.9783 14.7378L19.5447 13.9552L21.3585 24.4386L18.5913 21.5436ZM28.9009 17.8439C28.6989 16.6772 29.4966 15.5885 30.6688 15.3877C31.5692 15.2333 32.4273 15.5989 33.1571 16.0744L32.3363 12.0113C31.4439 11.8715 30.5306 11.8668 29.6301 12.0211C26.4711 12.5625 24.4312 15.4897 24.9728 18.6193C25.502 21.6776 28.3144 23.6419 31.3876 23.1154C32.0881 22.9952 33.5406 22.6292 34.1009 22.2109L33.5213 18.1797C32.9985 18.8991 32.3643 19.4033 31.4495 19.56C30.2775 19.761 29.1049 19.0244 28.9009 17.8439ZM33.527 14.936L33.3689 16.574L34.5123 16.3781L34.5962 16.8616L33.8813 16.9843L33.7234 18.6223L35.167 18.3751C36.3082 20.3766 38.5222 21.5203 40.9665 21.1014C41.667 20.9814 43.1196 20.6155 43.68 20.1971L43.3099 17.463C42.1131 17.9462 40.6457 18.2271 39.598 17.6156L42.4281 17.1308L42.5863 15.4925L38.5553 16.1832C38.5311 16.1288 38.5213 16.0718 38.5116 16.015L38.4796 15.83L38.4573 15.702L42.0738 15.0823L42.2319 13.4441L38.8585 14.022C39.6472 13.052 41.2292 12.7518 42.5282 12.6902L41.9153 9.99771C41.0226 9.85784 40.1094 9.85316 39.2088 10.0075C36.6933 10.4385 34.8702 12.4061 34.5275 14.7643L33.527 14.936ZM33.2002 24.6066C32.7805 24.6066 32.3434 24.8759 32.3434 25.3336C32.3434 25.7857 32.7806 26.0431 33.2002 26.0431C33.6199 26.0431 34.0568 25.7857 34.0568 25.3336C34.0569 24.8758 33.6199 24.6066 33.2002 24.6066ZM36.443 24.4522H37.1559C37.0813 24.7097 36.765 24.83 36.5178 24.83C36.0061 24.83 35.707 24.3836 35.707 23.9086C35.707 23.388 36.0175 22.9074 36.581 22.9074C36.8342 22.9074 37.0584 23.0161 37.179 23.2392L38.6509 22.7014C38.3118 21.9632 37.2768 21.5911 36.5234 21.5911C35.1607 21.5911 34.1201 22.4438 34.1201 23.8458C34.1201 25.2304 35.1896 26.0431 36.5121 26.0431C37.179 26.0431 37.892 25.7798 38.3521 25.2763C38.8637 24.7213 38.8581 24.1433 38.8753 23.4339H36.4431L36.443 24.4522ZM41.8249 24.315V24.2805C42.4055 24.0803 42.6643 23.8171 42.6643 23.1591C42.6643 22.0719 41.8422 21.6598 40.8589 21.6598H38.9556V25.9744H40.4964V24.5896H40.5253L41.2152 25.9744H43.0322L42.0891 24.5725C42.003 24.4409 41.9111 24.378 41.8249 24.315ZM40.6058 23.5711H40.4965V22.8386H40.6174C40.8933 22.8386 41.1233 22.8729 41.1233 23.2105C41.1232 23.531 40.8646 23.5711 40.6058 23.5711Z"/></svg>
                <span>BestPrice</span>
              </Link>
            </h1>
          </div>

          <div id="user" onClick={handleNavbarClick}>
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
            <div className="sitemap-button sitemap-button--desktop pressable" aria-label="Sitemap button" role="button" id="sitemap-toggle" onClick={(e) => { e.stopPropagation(); onSitemapToggle(); }}>
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
                <Link to="/account" className="text-sm font-medium">
                  My Account
                </Link>
                <ThemeToggle />
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
