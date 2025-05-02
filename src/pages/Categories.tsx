
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAllCategories, Category } from '@/services/categoryService';
import AllCategoriesView from '@/components/category/AllCategoriesView';

const Categories = () => {
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
    return <div className="container mx-auto p-4">Loading...</div>;
  }
  
  return (
    <>
      <Helmet>
        <title>All Categories</title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">All Categories</h1>
        
        <AllCategoriesView />
      </div>
    </>
  );
};

export default Categories;
