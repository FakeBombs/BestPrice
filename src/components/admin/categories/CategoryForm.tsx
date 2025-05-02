
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, CategoryCreate } from '@/services/categoryService';
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CategoryFormProps {
  category?: Category;
  categories?: Category[];
  onSubmit?: (values: CategoryCreate) => void;
  onSave?: (values: Partial<Category>) => void;
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
  category_type: z.enum(['main', 'sub']).default('sub'),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters."
  })
});

const CategoryForm: React.FC<CategoryFormProps> = ({ category, categories = [], onSubmit, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image_url: category?.image_url || '',
    parent_id: category?.parent_id ? String(category.parent_id) : '',
    category_type: category?.category_type || 'sub',
    slug: category?.slug || ''
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image_url: category?.image_url || "",
      parent_id: category?.parent_id ? String(category.parent_id) : "",
      category_type: (category?.category_type as 'main' | 'sub') || 'sub',
      slug: category?.slug || ""
    },
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        image_url: category.image_url || '',
        parent_id: category.parent_id ? String(category.parent_id) : '',
        category_type: category.category_type || 'sub',
        slug: category.slug
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleUpdate = () => {
    const updatedCategory = {
      ...formData,
      parent_id: formData.parent_id !== "" ? formData.parent_id : null,
    };
    if (onSave) onSave(updatedCategory);
    toast({
      title: "Category updated!",
      description: "Your category has been updated successfully.",
    });
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const handler = onSubmit || onSave;
    if (handler) {
      // Make sure slug is provided
      const finalValues: CategoryCreate = {
        name: values.name,
        slug: values.slug || values.name.toLowerCase().replace(/\s+/g, '-'),
        description: values.description,
        image_url: values.image_url,
        parent_id: values.parent_id || null,
        category_type: values.category_type
      };
      handler(finalValues);
    }
    
    toast({
      title: "Category created!",
      description: "Your category has been created successfully.",
    });
  };

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
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="category-slug" {...field} />
              </FormControl>
              <FormDescription>
                The URL-friendly version of the name.
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
          name="category_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="sub">Sub</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose whether this is a main category or subcategory.
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
        <div className="flex gap-4 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          )}
          {category ? (
            <Button type="button" onClick={handleUpdate}>Update Category</Button>
          ) : (
            <Button type="submit">Create Category</Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
