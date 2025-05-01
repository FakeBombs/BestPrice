
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { 
  getMainCategories, 
  getSubcategories, 
  deleteCategory, 
  Category 
} from '@/services/categoryService';
import { toast } from '@/hooks/use-toast';

interface CategoryListProps {
  parentId?: string | null;
  onCategorySelected?: (category: Category) => void;
}

const CategoryList = ({ parentId = null, onCategorySelected }: CategoryListProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        let data: Category[];
        if (parentId) {
          data = await getSubcategories(parentId);
        } else {
          data = await getMainCategories();
        }
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [parentId]);
  
  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setIsDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete);
      setCategories(categories.filter(cat => cat.id !== categoryToDelete));
      toast({
        title: "Success",
        description: "Category deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive"
      });
    } finally {
      setIsDialogOpen(false);
      setCategoryToDelete(null);
    }
  };
  
  const handleCategoryClick = (category: Category) => {
    if (onCategorySelected) {
      onCategorySelected(category);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {parentId ? 'Subcategories' : 'Main Categories'}
        </h2>
        <Button asChild>
          <Link to={parentId ? `/admin/categories/new?parentId=${parentId}` : "/admin/categories/new"}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center py-4 text-muted-foreground">No categories found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.name}
                  </button>
                </TableCell>
                <TableCell>{category.category_type}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/categories/edit/${category.id}`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteClick(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category and all its subcategories.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryList;
