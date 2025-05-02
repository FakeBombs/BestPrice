
import { Outlet } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';

const Layout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default Layout;
