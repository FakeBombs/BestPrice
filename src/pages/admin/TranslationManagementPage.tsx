
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TranslationKey {
  id: string;
  key: string;
  en: string;
  el: string;
  es: string;
  fr: string;
  de: string;
}

const TranslationManagementPage = () => {
  const { t } = useTranslation();
  const [translations, setTranslations] = useState<TranslationKey[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Load translations from database
  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        // Use a type assertion to bypass TypeScript's type checking
        const { data, error } = await (supabase as any)
          .from('translations')
          .select('*')
          .order('key');
          
        if (error) throw error;
        
        if (data) {
          setTranslations(data as TranslationKey[]);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load translations: " + error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTranslations();
  }, []);
  
  // Filter translations based on search
  const filteredTranslations = translations.filter(
    (item) => 
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.en.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle translation value change
  const handleChange = (id: string, field: string, value: string) => {
    setTranslations(
      translations.map((item) => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  // Save changes
  const saveTranslations = async () => {
    setIsSaving(true);
    try {
      // Create array of updates
      const updates = translations.map(({ id, key, en, el, es, fr, de }) => ({
        id,
        key,
        en,
        el,
        es,
        fr,
        de
      }));
      
      // Use a type assertion to bypass TypeScript's type checking
      const { error } = await (supabase as any)
        .from('translations')
        .upsert(updates);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Translations have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save translations: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Add new translation key
  const addTranslationKey = async () => {
    if (!newKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a translation key",
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicate
    if (translations.some(item => item.key === newKey)) {
      toast({
        title: "Error",
        description: "This translation key already exists",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newTranslation = {
        key: newKey,
        en: "",
        el: "",
        es: "",
        fr: "",
        de: ""
      };
      
      // Use a type assertion to bypass TypeScript's type checking
      const { data, error } = await (supabase as any)
        .from('translations')
        .insert(newTranslation)
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        setTranslations([...translations, data[0] as TranslationKey]);
        setNewKey("");
        setShowAddForm(false);
        
        toast({
          title: "Success",
          description: "New translation key added successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add translation key: " + error.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Translation Management</h1>
        <Button onClick={saveTranslations} disabled={isSaving}>
          {isSaving ? "Saving..." : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search translations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Translation
        </Button>
      </div>
      
      {showAddForm && (
        <div className="bg-muted p-4 rounded-md mb-6 flex items-center gap-2">
          <Input
            placeholder="New translation key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addTranslationKey} className="whitespace-nowrap">
            Add Key
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowAddForm(false)}
            className="whitespace-nowrap"
          >
            Cancel
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-8">Loading translations...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Key</TableHead>
                <TableHead>English</TableHead>
                <TableHead>Greek</TableHead>
                <TableHead>Spanish</TableHead>
                <TableHead>French</TableHead>
                <TableHead>German</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTranslations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {searchTerm ? "No translations match your search" : "No translations found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTranslations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.key}</TableCell>
                    <TableCell>
                      <Input
                        value={item.en || ""}
                        onChange={(e) => handleChange(item.id, "en", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.el || ""}
                        onChange={(e) => handleChange(item.id, "el", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.es || ""}
                        onChange={(e) => handleChange(item.id, "es", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.fr || ""}
                        onChange={(e) => handleChange(item.id, "fr", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.de || ""}
                        onChange={(e) => handleChange(item.id, "de", e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TranslationManagementPage;
