
import { Link } from 'react-router-dom';
import { RootCategory, Category } from '@/data/mockData';
import RootCategoryCard from '@/components/RootCategoryCard';
import CategoryCard from '@/components/CategoryCard';

interface AllCategoriesViewProps {
  rootCategories: RootCategory[];
  categories: Category[];
}

const AllCategoriesView = ({ rootCategories, categories }: AllCategoriesViewProps) => {
  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        <div id="trail"><CategoryBreadcrumb rootCategory={rootCategory} /></div>
        <h1 className="text-3xl font-bold mb-6">{rootCategory.name}</h1>
        <p className="text-muted-foreground mb-8">{RootCategory.description}</p>
        <div className="root-category__categories">
              {rootCategories.map((rootCat) => (
                <div className="root-category__category" key={rootCat.id}>
                  <RootCategoryCard key={rootCat.id} category={rootCat} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategoriesView;
