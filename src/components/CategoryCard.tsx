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
        return <Smartphone className="h-8 w-8" />;
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
  return <Link to={`/categories/${category.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md text-center h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center bg-[#26282c]">
          <div className="rounded-full bg-primary/10 p-3 mb-3">
            {getIcon()}
          </div>
          <h3 className="font-medium">{category.name}</h3>
        </CardContent>
      </Card>
    </Link>;
};
export default CategoryCard;