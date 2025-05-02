
import { categories, mainCategories } from '@/data/mockData';

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  image?: string;
  imageUrl?: string;
  parentId?: string | number | null;
  description?: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
  return [...categories];
};

export const getMainCategories = async (): Promise<Category[]> => {
  return [...mainCategories];
};

export const getSubcategoriesByParentId = async (parentId: string | number): Promise<Category[]> => {
  return categories.filter(cat => String(cat.parentId) === String(parentId));
};

export const getCategoriesByIds = async (ids: (string | number)[]): Promise<Category[]> => {
  const stringIds = ids.map(id => String(id));
  return categories.filter(cat => stringIds.includes(String(cat.id)));
};

export const getCategoryById = async (id: string | number): Promise<Category | undefined> => {
  const category = categories.find(cat => String(cat.id) === String(id)) || 
                  mainCategories.find(cat => String(cat.id) === String(id));
  
  return category ? {
    ...category,
    description: category.description || `Browse our ${category.name} collection`
  } : undefined;
};

export const getCategoryPath = async (categoryId: string | number): Promise<Category[]> => {
  const result: Category[] = [];
  const category = await getCategoryById(categoryId);
  
  if (!category) return result;
  
  result.push({
    ...category,
    description: category.description || `Browse our ${category.name} collection`
  });
  
  if (category.parentId) {
    const parentCategories = await getCategoryPath(category.parentId);
    return [...parentCategories, ...result];
  }
  
  return result;
};
