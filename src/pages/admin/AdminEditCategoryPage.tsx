
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import { getCategoryById, Category } from '@/services/categoryService';

const AdminEditCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        try {
          const categoryData = await getCategoryById(categoryId);
          if (categoryData) {
            setCategory(categoryData);
          }
        } catch (error) {
          console.error('Error fetching category:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCategory();
  }, [categoryId]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!category && !loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-xl font-bold mb-4">Category Not Found</h1>
        <p>The category you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Edit {category?.name}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold mb-6">Edit Category: {category?.name}</h1>
      
      <div className="max-w-2xl mx-auto">
        {categoryId && <CategoryForm categoryId={categoryId} />}
      </div>
    </div>
  );
};

export default AdminEditCategoryPage;
