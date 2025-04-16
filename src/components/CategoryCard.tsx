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
    <Card className="root-category__card">
      <CardContent className="root-category__content">
        <Link to={`/cat/${category.id}/${categorySlug}`} className="root-category__cover">
          <img src={category.image} alt={category.name} title={category.name} className="root-category__image" />
        </Link>
        <h2 className="root-category__category-title">
          <Link to={`/cat/${category.id}/${categorySlug}`}>{category.name}</Link>
        </h2>
        <div className="root-category__footer">
          <div className="root-category__links">
            <Link to="/">Κινητά</Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
