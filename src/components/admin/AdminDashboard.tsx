
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  LayoutGrid, 
  ShoppingBag, 
  Users, 
  Settings, 
  BarChart, 
  Store 
} from "lucide-react";
import AdminHeader from "./AdminHeader";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <AdminHeader title="Διαχείριση" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Επισκόπηση</TabsTrigger>
          <TabsTrigger value="stats">Στατιστικά</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link to="/admin/categories">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <LayoutGrid className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Κατηγορίες</CardTitle>
                  <CardDescription>Διαχείριση κατηγοριών και υποκατηγοριών</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-sm text-muted-foreground">Συνολικές κατηγορίες</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/products">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <Package className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Προϊόντα</CardTitle>
                  <CardDescription>Διαχείριση προϊόντων και τιμών</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">843</div>
                  <p className="text-sm text-muted-foreground">Συνολικά προϊόντα</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/stores">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <Store className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Καταστήματα</CardTitle>
                  <CardDescription>Διαχείριση καταστημάτων και προσφορών</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">56</div>
                  <p className="text-sm text-muted-foreground">Ενεργά καταστήματα</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/orders">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <ShoppingBag className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Παραγγελίες</CardTitle>
                  <CardDescription>Παρακολούθηση παραγγελιών και συναλλαγών</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">124</div>
                  <p className="text-sm text-muted-foreground">Παραγγελίες φέτος</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/users">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <Users className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Χρήστες</CardTitle>
                  <CardDescription>Διαχείριση λογαριασμών χρηστών</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,458</div>
                  <p className="text-sm text-muted-foreground">Εγγεγραμμένοι χρήστες</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/settings">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <Settings className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Ρυθμίσεις</CardTitle>
                  <CardDescription>Ρυθμίσεις εφαρμογής και παραμετροποίηση</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-sm text-muted-foreground">Γενικές ρυθμίσεις</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Επισκέψεις</CardTitle>
                <CardDescription>Επισκέψεις τους τελευταίους 30 ημέρες</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6">
                <BarChart className="h-[180px] w-[180px] text-muted-foreground opacity-50" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Συναλλαγές</CardTitle>
                <CardDescription>Συναλλαγές τους τελευταίους 30 ημέρες</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6">
                <BarChart className="h-[180px] w-[180px] text-muted-foreground opacity-50" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Νέοι Χρήστες</CardTitle>
                <CardDescription>Νέοι χρήστες τους τελευταίους 30 ημέρες</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6">
                <BarChart className="h-[180px] w-[180px] text-muted-foreground opacity-50" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
