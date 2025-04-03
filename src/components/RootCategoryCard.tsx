
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Smartphone, Laptop, Tablet, Headphones, Camera, Monitor, Home, 
  Gamepad, Dumbbell, Shirt, LucideIcon 
} from 'lucide-react';
import { RootCategory } from '@/data/mockData';

interface RootCategoryCardProps {
  category: RootCategory;
}

const RootCategoryCard = ({ category }: RootCategoryCardProps) => {
  const getIcon = (): JSX.Element => {
    switch (category.icon) {
      case 'smartphone':
        return <Smartphone className="h-10 w-10" />;
      case 'laptop':
        return <Laptop className="h-10 w-10" />;
      case 'tablet':
        return <Tablet className="h-10 w-10" />;
      case 'headphones':
        return <Headphones className="h-10 w-10" />;
      case 'camera':
        return <Camera className="h-10 w-10" />;
      case 'monitor':
        return <Monitor className="h-10 w-10" />;
      case 'home':
        return <Home className="h-10 w-10" />;
      case 'gamepad':
        return <Gamepad className="h-10 w-10" />;
      case 'dumbbell':
        return <Dumbbell className="h-10 w-10" />;
      case 'shirt':
        return <Shirt className="h-10 w-10" />;
      default:
        return <Smartphone className="h-10 w-10" />;
    }
  };

  return (
    <Link to={`/categories/root/${category.slug}?bpref=root-category`} className="root-category__cover">
             {getIcon()}
           <h2 className="root-category__category-title"><Link to={`/categories/root/${category.slug}?bpref=root-category__title`}>{category.name}</Link></h2>
           <p className="text-muted-foreground text-sm line-clamp-2">{category.description}</p>
     </Link>
  );
};

export default RootCategoryCard;
