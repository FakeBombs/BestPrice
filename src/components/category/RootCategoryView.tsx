
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubcategoriesByParentId, Category } from '@/services/categoryService';

interface RootCategoryViewProps {
  categoryId: string;
  name: string;
}

const RootCategoryView = ({ categoryId, name }: RootCategoryViewProps) => {
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const data = await getSubcategoriesByParentId(categoryId);
        setSubcategories(data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubcategories();
  }, [categoryId]);
  
  if (loading) {
    return <div>Loading subcategories...</div>;
  }
  
  if (subcategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No subcategories found for {name}</p>
        <Link to="/categories" className="mt-4 inline-block text-blue-600 hover:underline">
          Browse all categories
        </Link>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {subcategories.map((subcategory) => (
        <Link 
          to={`/cat/${subcategory.id}/${subcategory.slug}`}
          key={subcategory.id}
          className="group bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="aspect-square mb-4 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
            <img
              src={subcategory.imageUrl || '/dist/images/placeholder.svg'}
              alt={subcategory.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="font-medium group-hover:text-primary">{subcategory.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {subcategory.description || `Browse our ${subcategory.name} collection`}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default RootCategoryView;
