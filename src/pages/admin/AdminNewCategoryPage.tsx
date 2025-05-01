
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import { getCategoryById, Category } from '@/services/categoryService';

const AdminNewCategoryPage = () => {
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parentId');
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  
  useEffect(() => {
    const fetchParentCategory = async () => {
      if (parentId) {
        try {
          const category = await getCategoryById(parentId);
          if (category) {
            setParentCategory(category);
          }
        } catch (error) {
          console.error('Error fetching parent category:', error);
        }
      }
    };
    
    fetchParentCategory();
  }, [parentId]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/categories">Categories</BreadcrumbLink>
          </BreadcrumbItem>
          {parentCategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/admin/categories?parentId=${parentCategory.id}`}>
                  {parentCategory.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>New Category</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold mb-6">Create New Category</h1>
      
      <div className="max-w-2xl mx-auto">
        <CategoryForm parentId={parentId} />
      </div>
    </div>
  );
};

export default AdminNewCategoryPage;
