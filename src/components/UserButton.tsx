import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react'; // Keeping LogOut as it was used
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

interface UserDropdownContentProps {
  onLogout: () => void;
  user: {
    name: string;
    username: string;
    avatar: string | null;
    email: string;
  } | null;
}

const UserDropdownContent: React.FC<UserDropdownContentProps> = ({ onLogout, user }) => {
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  return (
    <div id="user-menu-popup" className="popup-bottom popup open is-popup" style={{ zIndex: 50 }}>
      <div className="popup-arrow" style={{ top: -6, left: 'calc(50% - 7px)' }}></div>
      <div className="popup-body">
        <div>
          <Link to="/@" className="user-menu__self">
            <aside>
              <div className="avatar avatar--tiny">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar || ''} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </aside>
            <main>
              <h3 className="user-menu__self-header">{user.name}</h3>
              <div className="user-menu__self-username">{user.username}</div>
            </main>
            <div className="user-menu__caret">
              <svg className="icon" aria-hidden="true" width="16" height="16"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use></svg>
            </div>
          </Link>
          <ul>
            <li><Link data-scrollto="#root" to={`/@${user.username}/products/want`}>{t('productsYouWant')}</Link></li>
            <li><Link data-scrollto="#root" to={`/@${user.username}/products/have`}>{t('productsYouHave')}</Link></li>
            <li><Link to="/deals/my">{t('myOffers')}</Link></li>
            <li><Link to="/account/price-drops">{t('priceDrops')}</Link></li>
          </ul>
          <ul>
            <li style={{ position: 'relative' }}>
              <Link className="collections__popup--link" data-scrollto="#root" to={`/@${user.username}/products/collections`}>
                <svg className="icon" aria-hidden="true" width="8" height="8" style={{ transform: 'rotate(180deg)', position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%) rotate(180deg)' }}><use xlinkHref="/public/dist/images/icons/icons.svg#icon-left-8"></use></svg>
                {t('myCollections')} (11)
              </Link>
            </li>
            <li><Link to="/c/new">{t('newCollection')}…</Link></li>
          </ul>
          <ul>
            <li>
              <Link to="/account/credits-club">
                {t('creditsClub')}
                <svg className="icon" aria-hidden="true" width="16" height="16"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-credits-16"></use></svg>
              </Link>
            </li>
          </ul>
          <ul className="Man2ECrxAr0MWX_S9quo">
            <li>
              <Link to="/account/orders">
                <div>{t('savedOrders')}</div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 4.7L8.017 7.997a.034.034 0 01-.034 0L2 4.701M8 8v6.666m0 0c.003 0 .006 0 .008-.002l5.982-3.326v.002a.021.021 0 00.01-.019V4.709a.023.023 0 00-.01-.019L8.008 1.336a.017.017 0 00-.016 0L2.01 4.689a.023.023 0 00-.01.019v6.612a.02.02 0 00.01.02l5.982 3.324a.017.017 0 00.008.002z"></path>
                </svg>
              </Link>
            </li>
          </ul>
          <ul>
            <li><Link to={`/@${user.username}/qna/questions`}>{t('myQuestions')}</Link></li>
            <li><Link data-scrollto="#root" to={`/@${user.username}/reviews/products`}>{t('myReviews')}</Link></li>
          </ul>
          <ul>
            <li><Link to={`/@${user.username}/friends`}>{t('myFriends')}</Link></li>
          </ul>
          <ul>
            <li>
              <Link to="/account">
                {t('settings')}
                <svg className="icon" aria-hidden="true" width="16" height="16"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-settings-16"></use></svg>
              </Link>
            </li>
          </ul>
          <ul className="last">
            <li>
              <button onClick={onLogout} className="w-full text-left">
                <LogOut className="mr-2 h-4 w-4 inline-block" />
                {t('logout')}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const UserButton = () => {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (user) {
    return (
      <div className="relative">
        <button onClick={toggleDropdown} className="relative h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || ''} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </button>
        {isDropdownOpen && (
          <UserDropdownContent onLogout={logout} user={user} />
        )}
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={authMode} />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <button className="ghost" onClick={handleLoginClick}>{t('signIn')}</button>
        <button onClick={handleRegisterClick}>{t('register')}</button>
      </div>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={authMode} />
    </>
  );
};

export default UserButton;
