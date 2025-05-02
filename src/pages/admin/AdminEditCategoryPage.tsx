
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCategoryById, deleteCategory } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';
import CategoryForm from '@/components/admin/categories/CategoryForm';

const AdminEditCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [category, setCategory] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (!categoryId) return;
    
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const categoryData = await getCategoryById(categoryId);
        if (categoryData) {
          setCategory(categoryData);
        } else {
          toast({
            title: "Error",
            description: "Category not found",
            variant: "destructive"
          });
          navigate('/admin/categories');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        toast({
          title: "Error",
          description: "Failed to load category details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategory();
  }, [categoryId, navigate, toast]);
  
  const handleUpdateCategory = async (data: any) => {
    try {
      // In a real app, you would update the category in the database
      console.log('Category updated:', data);
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteCategory = async () => {
    if (!categoryId) return;
    
    setIsDeleting(true);
    try {
      await deleteCategory(categoryId);
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading category...</span>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/admin/categories')} className="mr-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          <h1 className="text-2xl font-bold">Edit Category</h1>
        </div>
        
        <Button 
          variant="destructive" 
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash className="w-4 h-4 mr-2" />
              Delete Category
            </>
          )}
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {category && (
            <CategoryForm
              categoryData={category}
              mode="edit"
              onSubmit={handleUpdateCategory}
            />
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All products in this category will no longer be associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminEditCategoryPage;
