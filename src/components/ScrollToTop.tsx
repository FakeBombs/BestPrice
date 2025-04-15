import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);  // Scroll to top every time the path changes

  return null; // No markup is required, just behavior
};

export default ScrollToTop;
