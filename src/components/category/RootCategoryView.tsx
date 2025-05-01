
import { useEffect, useState } from 'react';
import { mockData } from '../../data/mockData';
import CategoryCard from '../CategoryCard';
import ProductCard from '../ProductCard';
import { Link } from 'react-router-dom';

interface RootCategoryViewProps {
  category: any;
}

export const RootCategoryView = ({ category }: RootCategoryViewProps) => {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  
  useEffect(() => {
    if (category) {
      // Find direct subcategories
      const directSubCats = mockData.categories.filter(cat => cat.parentId === category.id);
      setSubCategories(directSubCats);
      
      // Find featured products across subcategories
      const subCategoryIds = [category.id, ...directSubCats.map(cat => cat.id)];
      const featuredProds = mockData.products
        .filter(product => subCategoryIds.includes(product.categoryId))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      
      setFeaturedProducts(featuredProds);
    }
  }, [category]);

  const formatSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="py-4">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg h-full">
            <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
            <p className="text-gray-600 mb-6">{category.description || `All products in ${category.name} category and subcategories`}</p>
            
            <div className="space-y-2">
              {subCategories.slice(0, 8).map(subCat => (
                <Link 
                  key={subCat.id}
                  to={`/cat/${subCat.id}/${formatSlug(subCat.name)}`}
                  className="block p-2 hover:bg-white rounded transition"
                >
                  {subCat.name}
                </Link>
              ))}
            </div>
            
            {subCategories.length > 8 && (
              <Link 
                to={`/categories?parent=${category.id}`}
                className="mt-4 text-primary hover:underline block"
              >
                View all subcategories ({subCategories.length})
              </Link>
            )}
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.slice(0, 6).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Browse Subcategories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {subCategories.slice(0, 12).map(subCat => (
            <CategoryCard key={subCat.id} category={subCat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RootCategoryView;
