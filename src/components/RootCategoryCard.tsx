import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { RootCategory } from '@/data/mockData';

interface RootCategoryCardProps {
  category: RootCategory;
}

const RootCategoryCard = ({ category }: RootCategoryCardProps) => {
  return (
    <>
      <Link to={`/categories/root/${category.slug}?bpref=root-category`} className="root-category__cover">
        <img src={category.image} alt={category.name} title={category.name} className="root-category__image" />
      </Link>
      <h2 className="root-category__category-title">
        <Link to={`/categories/root/${category.slug}?bpref=root-category__title`}>{category.name}</Link>
      </h2>
      <p className="text-muted-foreground text-sm line-clamp-2">{category.description}</p>
    </>
  );
};

export default RootCategoryCard;
