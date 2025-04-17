import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { RootCategory, Category, categories } from '@/data/mockData';

interface RootCategoryCardProps {
  category: RootCategory;
}

const RootCategoryCard = ({ category }: RootCategoryCardProps) => {
  // Get the subcategories associated with this root category
  const subCategories = categories.filter(subCategory => subCategory.rootCategoryId === category.id);

  return (
    <>
      <Link to={`/cat/${category.slug}?bpref=root-category`} className="root-category__cover">
        <img src={category.image} alt={category.name} title={category.name} className="root-category__image" />
      </Link>
      <h2 className="root-category__category-title">
        <Link to={`/cat/${category.slug}?bpref=root-category__title`}>{category.name}</Link>
      </h2>
      <div className="root-category__footer">
        <div className="root-category__links">
          {subCategories.map(subCategory => (
            <Link key={subCategory.id} to={`/cat/${subCategory.slug}?bpref=root-category-subcat`} className="subcategory-link">
              {subCategory.name}
            </Link>
          )).reduce((prev, curr) => [prev, ', ', curr])}
        </div>
      </div>
    </>
  );
};

export default RootCategoryCard;
