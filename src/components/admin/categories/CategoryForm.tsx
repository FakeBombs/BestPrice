
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { createCategory, updateCategory, getAllCategories } from '@/services/categoryService';
import { formatSlug } from '@/data/mockData';

// Define form validation schema
const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().optional(),
  image_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  parent_id: z.string().optional(),
  category_type: z.enum(['main', 'sub']),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  slug: string;
  parent_id?: string;
  category_type: 'main' | 'sub';
}

type CategoryCreate = Omit<Category, 'id'>;

interface CategoryFormProps {
  category?: Category;
  mode: 'create' | 'edit';
  parentId?: string;
}

const CategoryForm = ({ category, mode, parentId }: CategoryFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories.",
          variant: "destructive"
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [toast]);

  // Default form values
  const defaultValues: CategoryFormValues = {
    name: category?.name || '',
    description: category?.description || '',
    image_url: category?.image_url || '',
    parent_id: category?.parent_id || parentId || '',
    category_type: category?.category_type || 'sub',
    slug: category?.slug || '',
  };

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  // Auto-generate slug when name changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        const generatedSlug = formatSlug(value.name || '');
        form.setValue('slug', generatedSlug);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        // Create new category
        const newCategory: CategoryCreate = {
          ...data,
          slug: data.slug || formatSlug(data.name),
        };
        
        const result = await createCategory(newCategory);
        
        if (result) {
          toast({
            title: "Success",
            description: "Category created successfully."
          });
          navigate('/admin/categories');
        } else {
          throw new Error("Failed to create category");
        }
      } else if (mode === 'edit' && category) {
        // Update existing category
        const result = await updateCategory(category.id, data);
        
        if (result) {
          toast({
            title: "Success",
            description: "Category updated successfully."
          });
          navigate('/admin/categories');
        } else {
          throw new Error("Failed to update category");
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="category-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Category description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="main">Main Category</SelectItem>
                  <SelectItem value="sub">Subcategory</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={form.watch('category_type') === 'main' || loadingCategories}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {categories
                    .filter(cat => cat.category_type === 'main')
                    .map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/categories')}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {mode === 'create' ? 'Create Category' : 'Update Category'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
