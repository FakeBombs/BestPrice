
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
        <div className="root-category__categories">
          {rootCategories.length > 0 && (
            <>
              {rootCategories.map((rootCat) => (
                <div className="root-category__category" key={rootCat.id}>
                  <RootCategoryCard key={rootCat.id} category={rootCat} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>










<>
      
      {/* Root Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {rootCategories.map((rootCat) => (
          <RootCategoryCard key={rootCat.id} category={rootCat} />
        ))}
      </div>
      
      {/* Subcategories */}
      <h2 className="text-2xl font-semibold mb-6">All Subcategories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
  </>
  );
};

export default AllCategoriesView;
