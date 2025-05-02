
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { 
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  createCategory, 
  updateCategory,
  getAllCategories
} from '@/services/categoryService';

// Formatting function for slugs
const formatSlug = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Remove multiple hyphens
};

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  slug: string;
  parent_id?: string;
  category_type: 'main' | 'sub';
}

export type CategoryCreate = Omit<Category, 'id'>;
export type CategoryUpdate = Partial<CategoryCreate>;

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters" }),
  category_type: z.enum(['main', 'sub']),
  image_url: z.string().optional(),
  parent_id: z.string().optional()
});

interface CategoryFormProps {
  category?: Category;
  mode: 'create' | 'edit';
  parentId?: string;
}

const CategoryForm = ({ category, mode, parentId }: CategoryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const defaultValues: CategoryCreate = {
    name: category?.name || '',
    description: category?.description || '',
    slug: category?.slug || '',
    category_type: category?.category_type || 'sub',
    image_url: category?.image_url || '',
    parent_id: category?.parent_id || parentId || undefined,
  };

  const form = useForm<CategoryCreate>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // Monitor name changes to update slug
  const watchName = form.watch("name");
  
  useEffect(() => {
    if (!form.getValues("slug") || form.getValues("slug") === "") {
      form.setValue("slug", formatSlug(watchName));
    }
  }, [watchName, form]);
  
  // Load parent categories
  useEffect(() => {
    const loadParentCategories = async () => {
      try {
        const categories = await getAllCategories();
        // Main categories can be parents
        const mainCategories = categories.filter(cat => 
          cat.category_type === 'main' && 
          // Don't include the current category as a parent option
          (!category || cat.id !== category.id)
        );
        setParentCategories(mainCategories);
      } catch (error) {
        console.error('Error loading parent categories:', error);
      }
    };
    
    loadParentCategories();
  }, [category]);

  const onSubmit = async (data: CategoryCreate) => {
    try {
      setIsSubmitting(true);
      
      if (mode === 'edit' && category) {
        // Update existing category
        const updated = await updateCategory(category.id, data);
        
        if (updated) {
          toast({
            title: "Success",
            description: "Category updated successfully."
          });
          navigate('/admin/categories');
        } else {
          throw new Error('Failed to update category.');
        }
      } else {
        // Create new category
        const created = await createCategory(data);
        
        if (created) {
          toast({
            title: "Success",
            description: "Category created successfully."
          });
          navigate('/admin/categories');
        } else {
          throw new Error('Failed to create category.');
        }
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
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
              <FormLabel>Category Name</FormLabel>
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
                  <SelectItem value="sub">Sub Category</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch("category_type") === 'sub' && (
          <FormField
            control={form.control}
            name="parent_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parent category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {parentCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
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
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/categories')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Create' : 'Update'} Category
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
