
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CategoryForm from '@/components/admin/categories/CategoryForm';

const AdminNewCategoryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parentId') || undefined;
  
  const handleCreateCategory = async (data: any) => {
    setIsSubmitting(true);
    try {
      // In a real app, you would save the category to the database
      console.log('New category data:', data);
      
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/admin/categories')} className="mr-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          <h1 className="text-2xl font-bold">Create New Category</h1>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <CategoryForm
            onSubmit={handleCreateCategory} 
            mode="create"
            parentId={parentId}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default AdminNewCategoryPage;
