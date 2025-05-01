
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SingleCategoryView } from '../components/category/SingleCategoryView';
import { RootCategoryView } from '../components/category/RootCategoryView';
import CategoryBreadcrumb from '../components/category/CategoryBreadcrumb';
import { mockData } from '../data/mockData';

export default function CategoryPage() {
  const { id } = useParams<{ id: string, slug: string }>();
  const [category, setCategory] = useState<any>(null);
  const [isRootCategory, setIsRootCategory] = useState(false);

  useEffect(() => {
    if (id) {
      // First try to find in mainCategories
      const rootCategory = mockData.mainCategories.find(cat => cat.id.toString() === id);
      
      if (rootCategory) {
        setCategory(rootCategory);
        setIsRootCategory(true);
      } else {
        // If not in mainCategories, search in categories
        const subCategory = mockData.categories.find(cat => cat.id.toString() === id);
        if (subCategory) {
          setCategory(subCategory);
          setIsRootCategory(false);
        }
      }
    }
  }, [id]);

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <CategoryBreadcrumb category={category} />
      
      {isRootCategory ? (
        <RootCategoryView category={category} />
      ) : (
        <SingleCategoryView category={category} />
      )}
    </div>
  );
}
