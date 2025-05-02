
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ChevronRight, Eye } from "lucide-react";
import { Category, getAllCategories, getSubcategoriesByParentId } from "@/services/categoryService";

interface CategoryListProps {
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
  parentId?: string | null;
  onCategorySelected?: (category: Category) => void;
}

const CategoryList = ({ onEdit, onDelete, parentId = null, onCategorySelected }: CategoryListProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getAllCategories();
        // Filter to only get main categories
        const mainCategories = allCategories.filter(
          cat => !cat.parentId // Use parentId instead of category_type
        );
        setCategories(mainCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        try {
          const subs = await getSubcategoriesByParentId(selectedCategory);
          setSubcategories(subs);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      } else {
        setSubcategories([]);
      }
    };
    
    fetchSubcategories();
  }, [selectedCategory]);
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
    
    if (onCategorySelected) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        onCategorySelected(category);
      }
    }
  };
  
  if (loading) {
    return <div className="text-center py-12">Loading categories...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link to="/admin/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Category
          </Link>
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium">Categories</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your product categories
          </p>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {categories.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No categories found. Create your first category.
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id}>
                <div 
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    selectedCategory === category.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => handleCategorySelect(category.id)}
                      className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <ChevronRight 
                        className={`h-4 w-4 transition-transform ${
                          selectedCategory === category.id ? 'transform rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    <div className="ml-2">
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {category.description ? (
                          category.description.substring(0, 60) + 
                          (category.description.length > 60 ? '...' : '')
                        ) : (
                          'No description'
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      asChild
                    >
                      <Link to={`/cat/${category.id}/${category.slug}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      asChild
                    >
                      <Link to={`/admin/categories/edit/${category.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    
                    {onDelete && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </div>
                
                {selectedCategory === category.id && subcategories.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    {subcategories.map((subcategory) => (
                      <div 
                        key={subcategory.id} 
                        className="p-3 pl-12 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div>
                          <h5 className="font-medium">{subcategory.name}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {subcategory.description ? (
                              subcategory.description.substring(0, 40) + 
                              (subcategory.description.length > 40 ? '...' : '')
                            ) : (
                              'No description'
                            )}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            asChild
                          >
                            <Link to={`/cat/${subcategory.id}/${subcategory.slug}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            asChild
                          >
                            <Link to={`/admin/categories/edit/${subcategory.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          
                          {onDelete && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => onDelete(subcategory.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
