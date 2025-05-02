
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories, Category } from '@/services/categoryService';

const AllCategoriesView = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  if (loading) {
    return <div>Loading categories...</div>;
  }
  
  // Filter main categories
  const mainCategories = categories.filter(cat => !cat.parent_id || cat.category_type === 'main');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mainCategories.map((category) => (
        <Link 
          to={`/cat/${category.id}/${category.slug}`}
          key={category.id}
          className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={category.image_url || '/dist/images/placeholder.svg'}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2">{category.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
              {category.description || `Explore our selection of ${category.name}`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AllCategoriesView;
