
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
        return <img src="//abpcdn.pstatic.gr/P/bpimg128/805_SX200Y200/1473253454/mobile.webp" srcSet="//abpcdn.pstatic.gr/P/bpimg128/805_SX400Y400/1473253454/mobile.webp 2x" alt="Τεχνολογία" title="Τεχνολογία"/>;
      case 'home-garden':
        return <img src="//abpcdn.pstatic.gr/P/bpimg128/2483_SX200Y200/1473176668/home-appliances.webp" srcSet="//abpcdn.pstatic.gr/P/bpimg128/2483_SX400Y400/1473176668/home-appliances.webp 2x" alt="Σπίτι & Κήπος" title="Σπίτι & Κήπος"/>;
      case 'fashion':
        return <img src="//abpcdn.pstatic.gr/P/bpimg128/2069_SX200Y200/1503657549/woman.webp" srcSet="//abpcdn.pstatic.gr/P/bpimg128/2069_SX400Y400/1503657549/woman.webp 2x" alt="Μόδα" title="Μόδα"/>;
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
  <>
    <Link to={`/categories/root/${category.slug}?bpref=root-category`} className="root-category__cover">{getIcon()}</Link>
    <h2 className="root-category__category-title"><Link to={`/categories/root/${category.slug}?bpref=root-category__title`}>{category.name}</Link></h2>
    <p className="text-muted-foreground text-sm line-clamp-2">{category.description}</p>
  </>
  );
};

export default RootCategoryCard;
