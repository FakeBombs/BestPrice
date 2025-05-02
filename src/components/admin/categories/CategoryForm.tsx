
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category, CategoryCreate, formatSlug } from '@/services/categoryService';
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

interface CategoryFormProps {
  category?: Category;
  categories?: Category[];
  onSubmit?: (values: CategoryCreate) => void;
  onSave?: (values: CategoryCreate) => void;
  onCancel?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  image_url: z.string().url({ message: "Please enter a valid URL." }),
  parent_id: z.string().optional(),
  slug: z.string().optional(),
  category_type: z.enum(['main', 'sub']).optional(),
});

const CategoryForm: React.FC<CategoryFormProps> = ({ category, categories = [], onSubmit, onSave, onCancel }) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<Category>>({
    name: category?.name || '',
    description: category?.description || '',
    image_url: category?.image_url || '',
    parent_id: category?.parent_id || '',
    category_type: category?.category_type || 'sub',
    slug: category?.slug || '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image_url: category?.image_url || "",
      parent_id: category?.parent_id || "",
      slug: category?.slug || "",
      category_type: category?.category_type || 'sub',
    },
  })

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
        image_url: category.image_url || "",
        parent_id: category.parent_id || "",
        slug: category.slug,
        category_type: category.category_type,
      });
      
      setFormData({
        name: category.name,
        description: category.description,
        image_url: category.image_url,
        parent_id: category.parent_id,
        slug: category.slug,
        category_type: category.category_type,
      });
    }
  }, [category, form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      parent_id: value !== "" ? value : null,
    });
  };

  const handleUpdate = () => {
    const categoryTypeToUse = formData.parent_id ? 'sub' : 'main';
    const slugToUse = formData.slug || formatSlug(formData.name || '');
    
    const updatedCategory: CategoryCreate = {
      name: formData.name || '',
      description: formData.description,
      image_url: formData.image_url,
      parent_id: formData.parent_id !== "" ? formData.parent_id : null,
      category_type: categoryTypeToUse,
      slug: slugToUse
    };
    
    if (onSave) onSave(updatedCategory);
    toast({
      title: "Category updated!",
      description: "Your category has been updated successfully.",
    })
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const categoryTypeToUse = values.parent_id ? 'sub' : 'main';
    const slugToUse = values.slug || formatSlug(values.name);
    
    const newCategory: CategoryCreate = {
      name: values.name,
      description: values.description,
      image_url: values.image_url,
      parent_id: values.parent_id !== "" ? values.parent_id : null,
      category_type: categoryTypeToUse,
      slug: slugToUse
    };
    
    const handler = onSubmit || onSave;
    if (handler) handler(newCategory);
    toast({
      title: "Category created!",
      description: "Your category has been created successfully.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of category.
              </FormDescription>
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
                <Textarea
                  placeholder="Category description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Write a detailed description for your category.
              </FormDescription>
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
                <Input placeholder="Image URL" {...field} />
              </FormControl>
              <FormDescription>
                Add an image URL for your category.
              </FormDescription>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose a parent category for this category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {category ? (
          <Button type="button" onClick={handleUpdate}>Update Category</Button>
        ) : (
          <Button type="submit">Create Category</Button>
        )}
      </form>
    </Form>
  );
};

export default CategoryForm;
