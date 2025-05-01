
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CategoryList from '@/components/admin/categories/CategoryList';
import { Category } from '@/services/categoryService';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const AdminCategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryPath, setCategoryPath] = useState<Category[]>([]);
  
  const handleCategorySelected = (category: Category) => {
    setSelectedCategory(category);
    setCategoryPath(prev => [...prev, category]);
  };
  
  const handleNavigateTo = (index: number) => {
    // Navigate to a specific level in the breadcrumb
    if (index === -1) {
      // Go to the root level
      setSelectedCategory(null);
      setCategoryPath([]);
    } else {
      const newPath = categoryPath.slice(0, index + 1);
      setSelectedCategory(newPath[newPath.length - 1]);
      setCategoryPath(newPath);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-normal"
                  onClick={() => handleNavigateTo(-1)}
                >
                  Main Categories
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {categoryPath.map((category, index) => (
              <div className="flex items-center" key={category.id}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto font-normal"
                      onClick={() => handleNavigateTo(index)}
                    >
                      {category.name}
                    </Button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {selectedCategory && (
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => {
              const newPath = [...categoryPath];
              newPath.pop();
              if (newPath.length > 0) {
                setSelectedCategory(newPath[newPath.length - 1]);
              } else {
                setSelectedCategory(null);
              }
              setCategoryPath(newPath);
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {categoryPath.length > 1 
              ? categoryPath[categoryPath.length - 2].name 
              : 'Main Categories'
            }
          </Button>
        </div>
      )}
      
      <CategoryList 
        parentId={selectedCategory?.id || null}
        onCategorySelected={handleCategorySelected}
      />
    </div>
  );
};

export default AdminCategoriesPage;
