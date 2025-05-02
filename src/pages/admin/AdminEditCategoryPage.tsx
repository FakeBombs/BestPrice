
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCategoryById, deleteCategory, Category } from '@/services/categoryService';
import { useToast } from '@/components/ui/use-toast';
import CategoryForm from '@/components/admin/categories/CategoryForm';

const AdminEditCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategory = async () => {
      try {
        if (categoryId) {
          const data = await getCategoryById(categoryId);
          if (data) {
            setCategory(data);
          }
        }
      } catch (error) {
        console.error('Error loading category:', error);
        toast({
          title: "Error",
          description: "Failed to load category data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [categoryId, toast]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      setIsDeleting(true);
      
      if (categoryId) {
        const success = await deleteCategory(categoryId);
        
        if (success) {
          toast({
            title: "Success",
            description: "Category deleted successfully."
          });
          navigate('/admin/categories');
        } else {
          throw new Error('Failed to delete category.');
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Category Not Found</h1>
        <p>The category you are looking for does not exist.</p>
        <Button onClick={() => navigate('/admin/categories')}>Back to Categories</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <Button 
          variant="destructive" 
          onClick={handleDelete} 
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Delete Category
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <CategoryForm 
            category={category}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEditCategoryPage;
