import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { X, Plus, Image } from "lucide-react";
import { Product, ProductPrice } from '@/data/productData';
import { Category, categories } from '@/data/categoriesData';
import { vendors } from '@/data/vendorData';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    id: '',
    title: '',
    brand: '',
    model: '',
    category: '',
    description: '',
    image: '',
    images: [],
    rating: 0,
    reviews: 0,
    specifications: {},
    prices: []
  });
  
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [newPrice, setNewPrice] = useState<Partial<ProductPrice>>({
    vendorId: '',
    price: 0,
    shippingCost: 0,
    inStock: true
  });
  
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        title: product.title,
        brand: product.brand,
        model: product.model,
        category: product.category,
        description: product.description,
        image: product.image,
        images: [...product.images],
        rating: product.rating,
        reviews: product.reviews,
        specifications: { ...product.specifications },
        prices: [...product.prices]
      });
    }
  }, [product]);
  
  const handleChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSpecAdd = () => {
    if (newSpec.key && newSpec.value) {
      setFormData(prev => ({
        ...prev,
        specifications: { 
          ...prev.specifications, 
          [newSpec.key]: newSpec.value 
        }
      }));
      setNewSpec({ key: '', value: '' });
    }
  };
  
  const handleSpecRemove = (key: string) => {
    const updatedSpecs = { ...formData.specifications };
    delete updatedSpecs[key];
    setFormData(prev => ({ ...prev, specifications: updatedSpecs }));
  };
  
  const handlePriceAdd = () => {
    if (newPrice.vendorId && newPrice.price) {
      setFormData(prev => ({
        ...prev,
        prices: [...(prev.prices || []), newPrice as ProductPrice]
      }));
      setNewPrice({ vendorId: '', price: 0, shippingCost: 0, inStock: true });
    }
  };
  
  const handlePriceRemove = (vendorId: string) => {
    setFormData(prev => ({
      ...prev,
      prices: (prev.prices || []).filter(p => p.vendorId !== vendorId)
    }));
  };
  
  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, we would upload these files to a server
      // For this demo, we'll just create placeholder URLs
      const newImages = Array.from(files).map((_, index) => 
        `https://placehold.co/400x400?text=New+Image+${index + 1}`
      );
      
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
      
      // If this is the first image, also set it as the main image
      if (!formData.image && newImages.length > 0) {
        setFormData(prev => ({ ...prev, image: newImages[0] }));
      }
    }
  };
  
  const handleImageRemove = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter(img => img !== imageUrl)
    }));
    
    // If we removed the main image, set the first remaining image as the main
    if (formData.image === imageUrl && formData.images && formData.images.length > 1) {
      const newMainImage = formData.images.find(img => img !== imageUrl);
      setFormData(prev => ({ ...prev, image: newMainImage }));
    }
  };
  
  const handleSetMainImage = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.brand || !formData.category) {
      toast({
        title: "Ελλιπή στοιχεία",
        description: "Παρακαλούμε συμπληρώστε όλα τα υποχρεωτικά πεδία.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a new ID if creating new product
    if (!formData.id) {
      formData.id = `p${Date.now().toString().slice(-5)}`;
    }
    
    // If no image is set, use a placeholder
    if (!formData.image) {
      const placeholder = `https://placehold.co/400x400?text=${encodeURIComponent(formData.title || 'Product')}`;
      formData.image = placeholder;
      formData.images = [placeholder];
    }
    
    // Default values for new products
    if (!product) {
      formData.rating = formData.rating || 4.0;
      formData.reviews = formData.reviews || 0;
    }
    
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{product ? 'Επεξεργασία Προϊόντος' : 'Νέο Προϊόν'}</CardTitle>
          <CardDescription>
            {product 
              ? 'Τροποποιήστε τα στοιχεία του προϊόντος' 
              : 'Συμπληρώστε τα στοιχεία για το νέο προϊόν'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Τίτλος Προϊόντος *</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand">Μάρκα *</Label>
              <Input 
                id="brand" 
                value={formData.brand} 
                onChange={(e) => handleChange('brand', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="model">Μοντέλο</Label>
              <Input 
                id="model" 
                value={formData.model} 
                onChange={(e) => handleChange('model', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Κατηγορία *</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε κατηγορία" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Περιγραφή</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Εικόνες Προϊόντος</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {formData.images && formData.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`relative rounded-md overflow-hidden border ${
                    formData.image === img ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Product ${index}`} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-1 right-1 flex gap-1">
                    <Button 
                      type="button"
                      variant="destructive" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => handleImageRemove(img)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {formData.image !== img && (
                      <Button 
                        type="button"
                        variant="default" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleSetMainImage(img)}
                      >
                        <Image className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {formData.image === img && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-xs p-1 text-center">
                      Κύρια Εικόνα
                    </div>
                  )}
                </div>
              ))}
              <div className="border border-dashed rounded-md flex items-center justify-center h-32">
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Προσθήκη</span>
                  <Input 
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageAdd}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Προδιαγραφές</Label>
            </div>
            
            <div className="space-y-2">
              {formData.specifications && Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div>
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleSpecRemove(key)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input 
                  placeholder="Τίτλος (π.χ. CPU)"
                  value={newSpec.key}
                  onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                />
                <Input 
                  placeholder="Τιμή (π.χ. Intel i5)"
                  value={newSpec.value}
                  onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                />
                <Button 
                  type="button"
                  onClick={handleSpecAdd}
                  disabled={!newSpec.key || !newSpec.value}
                >
                  Προσθήκη
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Τιμές από Καταστήματα</Label>
            </div>
            
            <div className="space-y-2">
              {formData.prices && formData.prices.map((price) => {
                const vendor = vendors.find(v => v.id === price.vendorId);
                return (
                  <div key={price.vendorId} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div>
                      <span className="font-medium">{vendor?.name || price.vendorId}:</span> 
                      €{price.price.toFixed(2)} 
                      {price.shippingCost > 0 && ` + €${price.shippingCost.toFixed(2)} μεταφορικά`}
                      {price.inStock ? ' (Διαθέσιμο)' : ' (Μη Διαθέσιμο)'}
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handlePriceRemove(price.vendorId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                <Select 
                  value={newPrice.vendorId}
                  onValueChange={(value) => setNewPrice({ ...newPrice, vendorId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Κατάστημα" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  type="number"
                  placeholder="Τιμή"
                  min={0}
                  step={0.01}
                  value={newPrice.price || ''}
                  onChange={(e) => setNewPrice({ ...newPrice, price: parseFloat(e.target.value) })}
                />
                <Input 
                  type="number"
                  placeholder="Μεταφορικά"
                  min={0}
                  step={0.01}
                  value={newPrice.shippingCost || ''}
                  onChange={(e) => setNewPrice({ ...newPrice, shippingCost: parseFloat(e.target.value) })}
                />
                <Button 
                  type="button"
                  onClick={handlePriceAdd}
                  disabled={!newPrice.vendorId || !newPrice.price}
                >
                  Προσθήκη
                </Button>
              </div>
            </div>
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
