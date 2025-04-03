
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Laptop, Tablet, Headphones, Camera, Monitor, Home, Gamepad, LucideIcon } from 'lucide-react';

import { Category } from '@/data/mockData';
interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({
  category
}: CategoryCardProps) => {
  const getIcon = (): JSX.Element => {
    switch (category.icon) {
      case 'smartphone':
        return <img src="//abpcdn.pstatic.gr/P/bpimg128/805_SX200Y200/1473253454/mobile.webp" srcSet="//abpcdn.pstatic.gr/P/bpimg128/805_SX400Y400/1473253454/mobile.webp 2x" alt="Κινητή Τηλεφωνία" title="Κινητή Τηλεφωνία"/>;
      case 'laptop':
        return <Laptop className="h-8 w-8" />;
      case 'tablet':
        return <Tablet className="h-8 w-8" />;
      case 'headphones':
        return <Headphones className="h-8 w-8" />;
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
    <Link to={`/categories/${category.id}?bpref=root-category`} className="root-category__cover">
            {getIcon()}
    </Link>
    <h2 className="root-category__category-title"><Link to={`/categories/${category.id}?bpref=root-category__title`}>{category.name}</Link></h2>
    <div className="root-category__footer">
      <div className="root-category__links">
        <Link to="/">Κινητά</Link>
      </div>
    </div>
);
export default CategoryCard;
