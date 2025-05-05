
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Heart, Bell, Settings, Wallet, Store, UserCircle, Users, MessageSquare, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';
import { useTranslation } from '@/hooks/useTranslation';

const UserButton = () => {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { t } = useTranslation();
  
  const handleLoginClick = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };
  
  const handleRegisterClick = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };
  
  // User is logged in
  if (user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Social Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/messages" className="cursor-pointer">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Messages</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/friends" className="cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                <span>Friends</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/photos" className="cursor-pointer">
                <ImageIcon className="mr-2 h-4 w-4" />
                <span>Photos</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/account/favorites" className="cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                <span>Favorites</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account/notifications" className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/wallet" className="cursor-pointer">
                <Wallet className="mr-2 h-4 w-4" />
                <span>Wallet</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/wallet/ads" className="cursor-pointer">
                <Store className="mr-2 h-4 w-4" />
                <span>Advertisements</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={authMode} />
      </>
    );
  }
  
  // User is not logged in
  return (
    <>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={handleLoginClick}>{t('signIn')}</Button>
        <Button onClick={handleRegisterClick}>{t('register')}</Button>
      </div>
      
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={authMode} />
    </>
  );
};

export default UserButton;
