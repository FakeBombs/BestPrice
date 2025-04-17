import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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

const CategoryCard = ({ category }: CategoryCardProps) => {
  const categorySlug = formatCategorySlug(category.name);

  return (
    <Card className="category-card">
      <CardContent className="category-card__content">
        <Link to={`/cat/${category.id}/${categorySlug}`} className="category-card__cover">
          <img src={category.image} alt={category.name} title={category.name} className="category-card__image" />
        </Link>
        <h2 className="category-card__title">
          <Link to={`/cat/${category.id}/${categorySlug}`}>{category.name}</Link>
        </h2>
        {/* No footer or subcategory links here since they do not exist */}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
