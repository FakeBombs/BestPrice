
import { categories, mainCategories } from '@/data/mockData';

export interface Category {
  id: string;
  parentId?: string | null;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  slug?: string;
  category_type: 'main' | 'sub';
}

export interface CategoryCreate {
  name: string;
  description?: string;
  image_url?: string;
  category_type?: 'main' | 'sub';
  parent_id?: string;
  slug?: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const allCategories = [...mainCategories, ...categories].map(cat => ({
        ...cat,
        category_type: cat.parentId ? 'sub' : 'main' as 'main' | 'sub',
        image_url: cat.imageUrl || cat.image
      }));
      resolve(allCategories as Category[]);
    }, 500);
  });
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const categoryFromMain = mainCategories.find(cat => cat.id === id);
      const categoryFromCategories = categories.find(cat => cat.id === id);
      
      const category = categoryFromMain || categoryFromCategories;
      
      if (!category) {
        resolve(null);
        return;
      }
      
      resolve({
        ...category,
        category_type: category.parentId ? 'sub' : 'main' as 'main' | 'sub',
        image_url: category.imageUrl || category.image
      } as Category);
    }, 500);
  });
};

export const getMainCategories = async (): Promise<Category[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const mappedMainCategories = mainCategories.map(cat => ({
        ...cat,
        category_type: 'main' as 'main',
        image_url: cat.imageUrl || cat.image
      }));
      resolve(mappedMainCategories as Category[]);
    }, 500);
  });
};

// Add the missing getSubcategoriesByParentId function
export const getSubcategoriesByParentId = async (parentId: string): Promise<Category[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const subcategories = categories.filter(cat => cat.parentId === parentId).map(cat => ({
        ...cat,
        category_type: 'sub' as 'sub',
        image_url: cat.imageUrl || cat.image
      }));
      resolve(subcategories as Category[]);
    }, 500);
  });
};
