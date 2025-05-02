
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, getAllCategories } from '@/services/categoryService';

const AllCategoriesView = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getAllCategories();
        setCategories(allCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Group categories by parent
  const mainCategories = categories.filter(cat => cat.category_type === 'main');
  const getCategoryChildren = (parentId: string) => 
    categories.filter(cat => cat.parentId === parentId);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mainCategories.map(category => (
          <div key={category.id} className="border rounded-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              <Link to={`/category/${category.id}`} className="text-primary hover:underline">
                {category.name}
              </Link>
            </h2>
            
            <ul className="space-y-2">
              {getCategoryChildren(category.id).map(subCategory => (
                <li key={subCategory.id}>
                  <Link 
                    to={`/category/${subCategory.id}`} 
                    className="text-gray-700 hover:text-primary hover:underline"
                  >
                    {subCategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCategoriesView;
