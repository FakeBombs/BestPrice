
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category, getAllCategories } from '@/services/categoryService';

interface CategoryFormProps {
  onSubmit: (data: any) => void;
  initialData?: Category;
  mode: 'create' | 'edit';
  parentId?: string | number;
}

const CategoryForm = ({ onSubmit, initialData, mode, parentId }: CategoryFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | number | undefined>(parentId || undefined);
  
  useEffect(() => {
    const fetchCategories = async () => {
      const allCategories = await getAllCategories();
      setCategories(allCategories);
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
      setDescription(initialData.description || '');
      setImageUrl(initialData.imageUrl || initialData.image || '');
      setSelectedParentId(initialData.parentId);
    }
  }, [initialData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      imageUrl,
      parentId: selectedParentId || null
    };
    
    onSubmit(formData);
  };
  
  const generateSlug = () => {
    setSlug(name.toLowerCase().replace(/\s+/g, '-'));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Electronics"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <div className="flex gap-2">
          <Input 
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g., electronics"
          />
          <Button type="button" variant="outline" onClick={generateSlug}>
            Generate
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Used in URLs. Leave empty to auto-generate.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the category"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input 
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL for category image"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="parentCategory">Parent Category (Optional)</Label>
        <Select 
          value={selectedParentId ? String(selectedParentId) : undefined} 
          onValueChange={(value) => setSelectedParentId(value)}
        >
          <SelectTrigger id="parentCategory">
            <SelectValue placeholder="Select a parent category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit">
        {mode === 'create' ? 'Create Category' : 'Update Category'}
      </Button>
    </form>
  );
};

export default CategoryForm;
