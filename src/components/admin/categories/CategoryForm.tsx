import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Category, 
  createCategory, 
  updateCategory, 
  getCategoryById, 
  getMainCategories 
} from '@/services/categoryService';
import { toast } from '@/hooks/use-toast';

interface CategoryFormProps {
  categoryId?: string;
  parentId?: string | null;
}

const CategoryForm = ({ categoryId, parentId }: CategoryFormProps) => {
  const navigate = useNavigate();
  const isEditing = Boolean(categoryId);
  
  const [loading, setLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    category_type: 'sub',
    parent_id: parentId || null,
    image_url: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch main categories for parent selection
        const mainCats = await getMainCategories();
        setMainCategories(mainCats);
        
        // If editing, fetch the category data
        if (isEditing && categoryId) {
          const category = await getCategoryById(categoryId);
          if (category) {
            setFormData({
              name: category.name,
              description: category.description || '',
              category_type: category.category_type,
              parent_id: category.parent_id,
              image_url: category.image_url || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categoryId, isEditing, parentId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }
    
    // Make sure name is not optional for CategoryCreate
    const categoryData: CategoryCreate = {
      name: formData.name,
      description: formData.description,
      category_type: formData.category_type as 'main' | 'sub',
      parent_id: formData.parent_id,
      slug: formData.slug || formatSlug(formData.name),
      image_url: formData.image_url
    };
    
    setLoading(true);
    try {
      let result;
      
      if (isEditing && categoryId) {
        result = await updateCategory(categoryId, categoryData);
      } else {
        result = await createCategory(categoryData);
      }
      
      toast({
        title: "Success",
        description: `Category ${isEditing ? 'updated' : 'created'} successfully.`
      });
      
      // Navigate back to categories list
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} category.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Category' : 'Create New Category'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update the details for this category.' 
            : 'Fill in the details to create a new category.'}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              disabled={loading}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category_type">Category Type</Label>
            <Select
              value={formData.category_type}
              onValueChange={(value) => handleSelectChange('category_type', value)}
              disabled={loading || isEditing}
            >
              <SelectTrigger id="category_type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main</SelectItem>
                <SelectItem value="sub">Sub</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.category_type === 'sub' && (
            <div className="space-y-2">
              <Label htmlFor="parent_id">Parent Category</Label>
              <Select
                value={formData.parent_id || undefined}
                onValueChange={(value) => handleSelectChange('parent_id', value)}
                disabled={loading}
              >
                <SelectTrigger id="parent_id">
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {mainCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              disabled={loading}
              placeholder="http://example.com/image.jpg"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/categories')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CategoryForm;
