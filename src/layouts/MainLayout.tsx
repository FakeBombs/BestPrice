
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import i18n from '@/utils/i18n';
import { useTheme } from '@/components/theme-provider';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    closeMenu();
  };

  return (
    <div className="page">
      <header className="page__header">
        <div className="header">
          <div className="header__in">
            <div className="header__logo">
              <Link to="/">
                <picture>
                  <img src="/dist/images/logo.svg" alt={t('header.logoAlt')} />
                </picture>
              </Link>
            </div>

            <div className="header__nav">
              <nav className="nav">
                <ul className="nav__list">
                  <li className="nav__item">
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `nav__link${isActive ? ' active' : ''}`
                      }
                      onClick={closeMenu}
                    >
                      {t('header.home')}
                    </NavLink>
                  </li>
                  <li className="nav__item">
                    <NavLink
                      to="/categories"
                      className={({ isActive }) =>
                        `nav__link${isActive ? ' active' : ''}`
                      }
                      onClick={closeMenu}
                    >
                      {t('header.categories')}
                    </NavLink>
                  </li>
                  <li className="nav__item">
                    <NavLink
                      to="/brands"
                      className={({ isActive }) =>
                        `nav__link${isActive ? ' active' : ''}`
                      }
                      onClick={closeMenu}
                    >
                      {t('header.brands')}
                    </NavLink>
                  </li>
                  <li className="nav__item">
                    <NavLink
                      to="/stores"
                      className={({ isActive }) =>
                        `nav__link${isActive ? ' active' : ''}`
                      }
                      onClick={closeMenu}
                    >
                      {t('header.stores')}
                    </NavLink>
                  </li>
                  <li className="nav__item">
                    <NavLink
                      to="/blog"
                      className={({ isActive }) =>
                        `nav__link${isActive ? ' active' : ''}`
                      }
                      onClick={closeMenu}
                    >
                      {t('header.blog')}
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="header__panel">
              <ul className="header__actions">
                <li className="header__action header__action--search">
                  <Link to="/search" className="header__action-link">
                    <svg aria-hidden="true" width="24" height="24">
                      <use xlinkHref="/dist/images/icons/search.svg#search"></use>
                    </svg>
                    <span className="header__action-name">{t('header.search')}</span>
                  </Link>
                </li>
                <li className="header__action header__action--cluster">
                  <Link to="/map" className="header__action-link">
                    <svg aria-hidden="true" width="24" height="24">
                      <use xlinkHref="/dist/images/icons/cluster.svg#cluster"></use>
                    </svg>
                    <span className="header__action-name">{t('header.map')}</span>
                  </Link>
                </li>
                <li className="header__action header__action--categories">
                  <Link to="/categories" className="header__action-link">
                    <svg aria-hidden="true" width="24" height="24">
                      <use xlinkHref="/dist/images/icons/categories.svg#categories"></use>
                    </svg>
                    <span className="header__action-name">{t('header.categories')}</span>
                  </Link>
                </li>
                <li className="header__action header__action--profile">
                  <Link to="/profile" className="header__action-link">
                    <svg aria-hidden="true" width="32" height="32">
                      <use xlinkHref="/dist/images/icons/actions.svg#person"></use>
                    </svg>
                    <span className="header__action-name">{t('header.profile')}</span>
                  </Link>
                </li>
                <li>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </li>
              </ul>
            </div>

            <button className="header__trigger" type="button" onClick={toggleMenu}>
              <span className="header__trigger-in">
                <svg aria-hidden="true" width="32" height="32">
                  <use xlinkHref="/dist/images/icons/menu.svg#menu"></use>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className={`page__mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav">
          <div className="mobile-nav__head">
            <div className="mobile-nav__logo">
              <Link to="/">
                <picture>
                  <img src="/dist/images/logo.svg" alt={t('header.logoAlt')} />
                </picture>
              </Link>
            </div>

            <button className="mobile-nav__close" type="button" onClick={closeMenu}>
              <svg aria-hidden="true" width="24" height="24">
                <use xlinkHref="/dist/images/icons/close.svg#close"></use>
              </svg>
            </button>
          </div>

          <div className="mobile-nav__lang">
            <ul className="lang">
              <li className={`lang__item ${i18n.language === 'el' ? 'active' : ''}`}>
                <button type="button" onClick={() => changeLanguage('el')}>
                  {t('languages.el')}
                </button>
              </li>
              <li className={`lang__item ${i18n.language === 'en' ? 'active' : ''}`}>
                <button type="button" onClick={() => changeLanguage('en')}>
                  {t('languages.en')}
                </button>
              </li>
            </ul>
          </div>

          <nav className="mobile-nav__nav">
            <ul className="nav__list">
              <li className="nav__item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `nav__link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  {t('header.home')}
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `nav__link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  {t('header.categories')}
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink
                  to="/brands"
                  className={({ isActive }) =>
                    `nav__link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  {t('header.brands')}
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink
                  to="/stores"
                  className={({ isActive }) =>
                    `nav__link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  {t('header.stores')}
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink
                  to="/blog"
                  className={({ isActive }) =>
                    `nav__link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  {t('header.blog')}
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `nav__link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  {t('header.profile')}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main className="page__content">{children}</main>

      <footer className="page__footer">
        <div className="footer">
          <div className="footer__in">
            <div className="footer__copyright">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
