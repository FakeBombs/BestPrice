import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { RootCategory } from '@/data/mockData';

interface RootCategoryCardProps {
  category: RootCategory;
}

const RootCategoryCard = ({ category }: RootCategoryCardProps) => {
  return (
    <Card className="root-category__category">
      <CardContent>
        <Link to={`/cat/${category.slug}?bpref=root-category`} className="root-category__cover">
          <img 
            src={category.image} 
            alt={category.name} 
            title={category.name} 
            className="root-category__image" 
          />
        </Link>
        <h2 className="root-category__category-title">
          <Link to={`/cat/${category.slug}?bpref=root-category__title`}>{category.name}</Link>
        </h2>
        <div className="root-category__footer">
          <div className="root-category__links">
            {category.categories.map((subCategory) => (
              <Link 
                key={subCategory.id} 
                to={`/cat/${subCategory.slug}?bpref=root-category-subcat`} 
              >
                {subCategory.name}
              </Link>
            )).reduce((prev, curr) => [prev, ', ', curr])} 
            {/* The reduce adds commas between links */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RootCategoryCard;
