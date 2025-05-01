import { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, AlertCircle, Image } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { Product, Category, categories, getBestPrice, products } from "@/data/mockData";

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, product: Product | null}>({
    open: false,
    product: null
  });
  
  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || String(product.categoryId) === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleSaveProduct = (productData: Partial<Product>) => {
    // In a real app, this would save to the database
    toast({
      title: productData.id ? "Προϊόν ενημερώθηκε" : "Νέο προϊόν προστέθηκε",
      description: `Το προϊόν "${productData.title}" ${productData.id ? 'ενημερώθηκε' : 'προστέθηκε'} επιτυχώς.`,
    });
    
    setNewProductOpen(false);
    setEditProduct(null);
  };
  
  const handleDeleteProduct = () => {
    if (deleteDialog.product) {
      // In a real app, this would delete from the database
      toast({
        title: "Προϊόν διαγράφηκε",
        description: `Το προϊόν "${deleteDialog.product.title}" διαγράφηκε επιτυχώς.`,
      });
      
      setDeleteDialog({ open: false, product: null });
    }
  };
  
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Διαχείριση Προϊόντων"
        backLink="/admin"
        actionButton={{
          label: "Νέο Προϊόν",
          onClick: () => setNewProductOpen(true)
        }}
      />
      
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Αναζήτηση προϊόντος..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-[200px]">
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Όλες οι κατηγορίες" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Όλες οι κατηγορίες</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Δεν βρέθηκαν προϊόντα</h3>
          <p className="text-muted-foreground mt-1">
            Δοκιμάστε άλλους όρους αναζήτησης ή προσθέστε ένα νέο προϊόν
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setNewProductOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Νέο Προϊόν
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Τίτλος</TableHead>
                <TableHead>Κατηγορία</TableHead>
                <TableHead>Τιμή</TableHead>
                <TableHead>Αξιολόγηση</TableHead>
                <TableHead className="w-[120px] text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const bestPrice = getBestPrice(product);
                const categoryName = categories.find(cat => String(cat.id) === String(product.categoryId))?.name || "";
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden border">
                        <img 
                          src={product.image} 
                          alt={product.title || product.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {product.title || product.name}
                    </TableCell>
                    <TableCell>{categoryName}</TableCell>
                    <TableCell>
                      {bestPrice ? `€${bestPrice.price.toFixed(2)}` : `€${product.price.toFixed(2)}`}
                    </TableCell>
                    <TableCell>{product.rating.toFixed(1)}/5.0</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteDialog({ open: true, product })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* New Product Dialog */}
      <Dialog open={newProductOpen} onOpenChange={setNewProductOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ProductForm
            onSave={handleSaveProduct}
            onCancel={() => setNewProductOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog 
        open={editProduct !== null} 
        onOpenChange={(open) => !open && setEditProduct(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editProduct && (
            <ProductForm
              product={editProduct}
              onSave={handleSaveProduct}
              onCancel={() => setEditProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, product: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Διαγραφή Προϊόντος</DialogTitle>
            <DialogDescription>
              Είστε βέβαιοι ότι θέλετε να διαγράψετε το προϊόν "{deleteDialog.product?.title}"?
              <br />
              Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Άκυρο</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Διαγραφή
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
