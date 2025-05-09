import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import CategoryForm from "@/components/admin/CategoryForm";
import { Category, categories } from "@/data/categoriesData";

export default function AdminCategoriesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, category: Category | null}>({
    open: false,
    category: null
  });
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSaveCategory = (categoryData: Partial<Category>) => {
    // In a real app, this would save to the database
    toast({
      title: categoryData.id ? "Κατηγορία ενημερώθηκε" : "Νέα κατηγορία προστέθηκε",
      description: `Η κατηγορία "${categoryData.name}" ${categoryData.id ? 'ενημερώθηκε' : 'προστέθηκε'} επιτυχώς.`,
    });
    
    setNewCategoryOpen(false);
    setEditCategory(null);
  };
  
  const handleDeleteCategory = () => {
    if (deleteDialog.category) {
      // In a real app, this would delete from the database
      toast({
        title: "Κατηγορία διαγράφηκε",
        description: `Η κατηγορία "${deleteDialog.category.name}" διαγράφηκε επιτυχώς.`,
      });
      
      setDeleteDialog({ open: false, category: null });
    }
  };
  
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Διαχείριση Κατηγοριών"
        backLink="/admin"
        actionButton={{
          label: "Νέα Κατηγορία",
          onClick: () => setNewCategoryOpen(true)
        }}
      />
      
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Αναζήτηση κατηγορίας..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Δεν βρέθηκαν κατηγορίες</h3>
          <p className="text-muted-foreground mt-1">
            Δοκιμάστε άλλους όρους αναζήτησης ή προσθέστε μια νέα κατηγορία
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setNewCategoryOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Νέα Κατηγορία
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Όνομα</TableHead>
                <TableHead>Βασική Κατηγορία</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="w-[120px] text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.parentId ? categories.find(cat => cat.id === category.parentId)?.name : 'N/A'}</TableCell>
                  <TableCell className="text-muted-foreground">{category.id}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditCategory(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteDialog({ open: true, category })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* New Category Dialog */}
      <Dialog open={newCategoryOpen} onOpenChange={setNewCategoryOpen}>
        <DialogContent className="max-w-2xl">
          <CategoryForm
            onSave={handleSaveCategory}
            onCancel={() => setNewCategoryOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog 
        open={editCategory !== null} 
        onOpenChange={(open) => !open && setEditCategory(null)}
      >
        <DialogContent className="max-w-2xl">
          {editCategory && (
            <CategoryForm
              category={editCategory}
              onSave={handleSaveCategory}
              onCancel={() => setEditCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, category: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Διαγραφή Κατηγορίας</DialogTitle>
            <DialogDescription>
              Είστε βέβαιοι ότι θέλετε να διαγράψετε την κατηγορία "{deleteDialog.category?.name}"?
              <br />
              Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Άκυρο</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Διαγραφή
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
