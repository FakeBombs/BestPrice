
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Laptop, Tablet, Headphones, Camera, Monitor, Home, Gamepad, LucideIcon } from 'lucide-react';

import { Category } from '@/data/mockData';
interface CategoryCardProps {
  category: Category;
}

const formatCategorySlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const CategoryCard = ({
  category
}: CategoryCardProps) => {
  const categorySlug = formatCategorySlug(category.name);
  
  const getIcon = (): JSX.Element => {
    switch (category.icon) {
      case 'smartphone':
        return <img src="//abpcdn.pstatic.gr/P/bpimg128/805_SX200Y200/1473253454/mobile.webp" srcSet="//abpcdn.pstatic.gr/P/bpimg128/805_SX400Y400/1473253454/mobile.webp 2x" alt="Κινητή Τηλεφωνία" title="Κινητή Τηλεφωνία"/>;
      case 'pc':
        return <img src="//abpcdn.pstatic.gr/P/bpimg128/2544_SX200Y200/1476345319/ypologistes.webp" srcSet="//abpcdn.pstatic.gr/P/bpimg128/2544_SX400Y400/1476345319/ypologistes.webp 2x" alt="Υπολογιστές" title="Υπολογιστές"/>;
      case 'laptops-accessories':
        return <img src="//abpcdn.pstatic.gr/P/bpimg128/2590_SX200Y200/1475756993/laptops-accessories.webp" srcSet="//abpcdn.pstatic.gr/P/bpimg128/2590_SX400Y400/1475756993/laptops-accessories.webp 2x" alt="Laptops, Αξεσουάρ" title="Laptops, Αξεσουάρ"/>;
      case 'headphones':
        return <img src="//abpcdn.pstatic.gr/P/bpimg128/8068_SX200Y200/1629455538/headphones.webp" srcset="//abpcdn.pstatic.gr/P/bpimg128/8068_SX400Y400/1629455538/headphones.webp 2x" alt="Headphones" title="Headphones"/>;
      case 'camera':
        return <Camera className="h-8 w-8" />;
      case 'monitor':
        return <Monitor className="h-8 w-8" />;
      case 'home':
        return <Home className="h-8 w-8" />;
      case 'gamepad':
        return <Gamepad className="h-8 w-8" />;
      default:
        return <Smartphone className="h-8 w-8" />;
    }
  };
  
  return (
  <>
    <Link to={`/cat/${category.id}/${categorySlug}`} className="root-category__cover">
            {getIcon()}
    </Link>
    <h2 className="root-category__category-title"><Link to={`/cat/${category.id}/${categorySlug}`}>{category.name}</Link></h2>
    <div className="root-category__footer">
      <div className="root-category__links">
        <Link to="/">Κινητά</Link>
      </div>
    </div>
  </>
  );
};
export default CategoryCard;
