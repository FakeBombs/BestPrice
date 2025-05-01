
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCategories, 
  getProductsByCategory, 
  getCategoryById 
} from '@/data/mockData';
import AllCategoriesView from '@/components/category/AllCategoriesView';
import SingleCategoryView from '@/components/category/SingleCategoryView';

const formatCategorySlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const Categories = () => {
  const { categoryId, categorySlug } = useParams<{ 
    categoryId?: string; 
    categorySlug?: string;
  }>();
  const navigate = useNavigate();

  // If categoryId is provided, we're viewing a specific category
  const category = categoryId ? getCategoryById(categoryId) : null;

  // Redirect legacy URLs to new format
  useEffect(() => {
    if (category && !categorySlug) {
      const correctSlug = formatCategorySlug(category.name);
      navigate(`/cat/${categoryId}/${correctSlug}`, { replace: true });
    }
  }, [categoryId, category, categorySlug, navigate]);

  // Determine which view to render
  if (category) {
    return <SingleCategoryView category={category} />;
  } else {
    return <AllCategoriesView />;
  }
};

export default Categories;
