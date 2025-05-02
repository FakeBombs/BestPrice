
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMainCategories, getSubcategoriesByParentId, Category } from '@/services/categoryService';

interface CategoryFiltersProps {
  query: string;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ query }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const mainCategories = await getMainCategories();
        setCategories(mainCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  if (loading) {
    return (
      <div className="filter-category filter-collapsed default-list">
        <div className="filter__header"><h4>Κατηγορίες</h4></div>
        <div className="filter-container">
          <p className="text-center py-2">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="filter-category filter-collapsed default-list">
      <div className="filter__header"><h4>Κατηγορίες</h4></div>
      <div className="filter-container">
        <ol>
          {categories.map(category => (
            <li key={category.id}>
              <Link 
                to={`/cat/${category.id}/${category.slug}`}
                className="flex items-center justify-between"
              >
                <span>{category.name}</span>
                <span className="text-xs text-gray-500">›</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default CategoryFilters;
