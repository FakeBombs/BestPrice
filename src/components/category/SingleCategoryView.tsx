
import { useEffect, useState } from 'react';
import { mockData } from '../../data/mockData';
import CategoryCard from '../CategoryCard';
import ProductCard from '../ProductCard';
import { Link } from 'react-router-dom';

interface SingleCategoryViewProps {
  category: any;
}

export const SingleCategoryView = ({ category }: SingleCategoryViewProps) => {
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    if (category) {
      // Find child categories
      const children = mockData.categories.filter(cat => String(cat.parentId) === String(category.id));
      setChildCategories(children);
      
      // Find products in this category
      const categoryProducts = mockData.products.filter(product => 
        String(product.categoryId) === String(category.id)
      ).slice(0, 12); // Limit to 12 products for display
      
      setProducts(categoryProducts);
    }
  }, [category]);

  const formatSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-600 mb-6">{category.description || `Browse all products in ${category.name}`}</p>
      
      {childCategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {childCategories.map(childCat => (
              <CategoryCard key={childCat.id} category={childCat} />
            ))}
          </div>
        </div>
      )}
      
      {products.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {products.length === 12 && (
            <div className="text-center mt-6">
              <Link 
                to={`/search?category=${category.id}`}
                className="inline-block px-6 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found in this category</p>
        </div>
      )}
    </div>
  );
};

export default SingleCategoryView;
