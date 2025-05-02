
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Category, getMainCategories, getSubcategoriesByParentId } from '@/services/categoryService';

export interface CategoryFormProps {
  onSubmit: (data: any) => void;
  categoryData?: Category;
  mode?: 'create' | 'edit';
  parentId?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  onSubmit, 
  categoryData, 
  mode = 'create', 
  parentId 
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const mainCats = await getMainCategories();
        setMainCategories(mainCats);
        
        // If editing, set the initial values
        if (mode === 'edit' && categoryData) {
          setValue('name', categoryData.name);
          setValue('description', categoryData.description || '');
          setValue('image_url', categoryData.image_url || '');
          setValue('category_type', categoryData.category_type || 'sub');
          
          if (categoryData.parent_id) {
            setValue('parent_id', categoryData.parent_id);
            setSelectedMainCategory(categoryData.parent_id);
            
            const subCats = await getSubcategoriesByParentId(categoryData.parent_id);
            setSubcategories(subCats);
          }
        } else if (parentId) {
          setValue('parent_id', parentId);
          setSelectedMainCategory(parentId);
          
          const subCats = await getSubcategoriesByParentId(parentId);
          setSubcategories(subCats);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive"
        });
      }
    };
    
    fetchCategories();
  }, [mode, categoryData, setValue, toast, parentId]);
  
  const handleMainCategoryChange = async (value: string) => {
    setSelectedMainCategory(value);
    setValue('parent_id', value);
    
    try {
      const subCats = await getSubcategoriesByParentId(value);
      setSubcategories(subCats);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };
  
  const handleFormSubmit = (data: any) => {
    // Convert slug from name if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            {...register('name', { required: 'Name is required' })} 
            placeholder="Category Name" 
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message?.toString()}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input 
            id="slug" 
            {...register('slug')} 
            placeholder="category-slug (optional, will be generated from name)" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input 
            id="image_url" 
            {...register('image_url')} 
            placeholder="https://example.com/image.jpg" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category_type">Category Type</Label>
          <Select 
            onValueChange={(value) => setValue('category_type', value)} 
            defaultValue={categoryData?.category_type || 'sub'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Main Category</SelectItem>
              <SelectItem value="sub">Subcategory</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="parent_id">Parent Category</Label>
          <Select 
            onValueChange={handleMainCategoryChange} 
            defaultValue={categoryData?.parent_id || parentId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None (Root Category)</SelectItem>
              {mainCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          {...register('description')} 
          placeholder="Enter category description..." 
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/admin/categories')}
        >
          Cancel
        </Button>
        <Button type="submit">
          {mode === 'edit' ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
