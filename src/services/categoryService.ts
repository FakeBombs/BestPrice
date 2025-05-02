
import { categories, mainCategories } from "@/data/mockData";

export interface Category {
  id: string;
  parentId?: string | null;
  name: string;
  description: string;
  imageUrl?: string;
  image?: string;
  slug?: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
  return [...mainCategories, ...categories];
};

export const getMainCategories = async (): Promise<Category[]> => {
  return [...mainCategories];
};

export const getSubcategories = async (parentId: string): Promise<Category[]> => {
  return categories.filter((cat) => cat.parentId === parentId);
};

// Adding this function to match the import in CategoryList.tsx
export const getSubcategoriesByParentId = async (parentId: string): Promise<Category[]> => {
  return categories.filter((cat) => cat.parentId === parentId);
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const category = mainCategories.find((cat) => cat.id === id) || 
                  categories.find((cat) => cat.id === id);
  
  return category || null;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const category = mainCategories.find((cat) => cat.slug === slug) || 
                  categories.find((cat) => cat.slug === slug);
  
  return category || null;
};

export const getCategoryPath = async (categoryId: string): Promise<Category[]> => {
  const result: Category[] = [];
  let currentId = categoryId;
  
  while (currentId) {
    const category = await getCategoryById(currentId);
    if (!category) break;
    
    result.unshift(category);
    currentId = category.parentId || '';
  }
  
  return result;
};

export const createCategory = async (category: Partial<Category>): Promise<Category> => {
  // This is a mock function that would normally save to a database
  console.log("Creating category:", category);
  return {
    id: `new-${Date.now()}`,
    name: category.name || '',
    description: category.description || '',
    parentId: category.parentId,
    image: category.image,
    imageUrl: category.imageUrl,
    slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || '',
  };
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category> => {
  // This is a mock function that would normally update a database
  console.log("Updating category:", id, category);
  return {
    id,
    name: category.name || '',
    description: category.description || '',
    parentId: category.parentId,
    image: category.image,
    imageUrl: category.imageUrl,
    slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || '',
  };
};

export const deleteCategory = async (id: string): Promise<void> => {
  // This is a mock function that would normally delete from a database
  console.log("Deleting category:", id);
};
