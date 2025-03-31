
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
    <>
      <h1 className="text-3xl font-bold mb-8">All Categories</h1>
      
      {/* Root Categories */}
      <h2 className="text-2xl font-semibold mb-6">Main Categories</h2>
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
