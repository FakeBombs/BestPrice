
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Category, RootCategory, categories, rootCategories } from "@/data/mockData";

interface CategoryFormProps {
  category?: Category;
  onSave: (category: Partial<Category>) => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    id: '',
    name: '',
    rootCategoryId: '',
    icon: ''
  });
  
  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        rootCategoryId: category.rootCategoryId,
        icon: category.icon
      });
    }
  }, [category]);
  
  const handleChange = (field: keyof Category, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.rootCategoryId) {
      toast({
        title: "Ελλιπή στοιχεία",
        description: "Παρακαλούμε συμπληρώστε όλα τα υποχρεωτικά πεδία.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a new ID if creating new category
    if (!formData.id) {
      formData.id = `c${categories.length + 1}`;
    }
    
    // Use default icon if not provided
    if (!formData.icon) {
      formData.icon = 'box';
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
            <Label htmlFor="rootCategory">Βασική Κατηγορία *</Label>
            <Select 
              value={formData.rootCategoryId}
              onValueChange={(value) => handleChange('rootCategoryId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε βασική κατηγορία" />
              </SelectTrigger>
              <SelectContent>
                {rootCategories.map((rootCat) => (
                  <SelectItem key={rootCat.id} value={rootCat.id}>
                    {rootCat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon">Εικονίδιο</Label>
            <Input 
              id="icon" 
              value={formData.icon} 
              onChange={(e) => handleChange('icon', e.target.value)}
              placeholder="π.χ. smartphone, laptop, home"
            />
            <p className="text-xs text-muted-foreground">
              Χρησιμοποιήστε ονόματα εικονιδίων από τη βιβλιοθήκη Lucide (π.χ. smartphone, laptop, home)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Εικόνα Κατηγορίας</Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
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
