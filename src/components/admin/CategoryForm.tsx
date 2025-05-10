import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Category, categories } from "@/data/categoriesData";

interface CategoryFormProps {
  category?: Category;
  onSave: (category: Partial<Category>) => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    id: '',
    name: '',
    slug: '',
    parentId: undefined,
    image: '',
  });
  
  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        image: category.image,
      });
    }
  }, [category]);
  
  const handleChange = (field: keyof Category, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || (formData.parentId === undefined)) {
      toast({
        title: "Ελλιπή στοιχεία",
        description: "Παρακαλούμε συμπληρώστε όλα τα υποχρεωτικά πεδία.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a new ID if creating a new category
    if (!formData.id) {
      formData.id = `c${categories.length + 1}`;
    }
    
    // Use a default image if not provided
    if (!formData.image) {
      formData.image = '//placehold.co/200x200'; // Placeholder if no image is provided
    }
    
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{category ? 'Επεξεργασία Κατηγορίας' : 'Νέα Κατηγορία'}</CardTitle>
          <CardDescription>
            {category 
              ? 'Τροποποιήστε τα στοιχεία της κατηγορίας' 
              : 'Συμπληρώστε τα στοιχεία για τη νέα κατηγορία'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Όνομα Κατηγορίας *</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parentId">Βασική Κατηγορία *</Label>
            <Select 
              value={formData.parentId?.toString() || ''}
              onValueChange={(value) => handleChange('parentId', Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε βασική κατηγορία" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Εικόνα Κατηγορίας</Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={(e) => handleChange('image', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Προαιρετικά: Ανεβάστε μια εικόνα για την κατηγορία
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>Ακύρωση</Button>
          <Button type="submit">Αποθήκευση</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
