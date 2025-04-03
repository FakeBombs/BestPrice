
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Laptop, Tablet, Headphones, Camera, Monitor, Home, Gamepad, LucideIcon } from 'lucide-react';

import { Category } from '@/data/mockData';
interface CategoryCardProps {
  category: Category;
}

import { rootCategories } from '@/data/mockData';
interface rootCategoriesCardProps {
  rootCategories: rootCategoryId;
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
  return <Link to={`/categories/${category.id}`} className="root-category__cover">
      <Card>
        <CardContent>
            {getIcon()}
          <h2 className="root-category__category-title">{category.name}</h2>
          <div className="root-category__footer">
            <div className="root-category__links">
              <Link to={`/categories/root/${rootCategory.slug}`}></Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>;
};
export default CategoryCard;
