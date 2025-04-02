
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import NotificationSettings from '@/components/NotificationSettings';
import AuthModal from '@/components/AuthModal';

const AccountPage = () => {
  const { section } = useParams<{ section?: string }>();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Set the active tab based on URL params
  useEffect(() => {
    if (section) {
      const validSections = ['profile', 'favorites', 'notifications', 'settings'];
      if (validSections.includes(section)) {
        setActiveTab(section);
      }
    }
  }, [section]);
  
  // Redirect if user is not logged in
  useEffect(() => {
    if (!user && !authModalOpen) {
      setAuthModalOpen(true);
    }
  }, [user]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/account/${value}`);
  };
  
  if (!user) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">Απαιτείται Σύνδεση</h1>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Συνδεθείτε ή δημιουργήστε λογαριασμό για να αποκτήσετε πρόσβαση στο προφίλ σας.
          </p>
          <Button onClick={() => setAuthModalOpen(true)}>
            Σύνδεση / Εγγραφή
          </Button>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => navigate('/')} />
      </>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ο Λογαριασμός μου</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Προφίλ</TabsTrigger>
          <TabsTrigger value="favorites">Αγαπημένα</TabsTrigger>
          <TabsTrigger value="notifications">Ειδοποιήσεις</TabsTrigger>
          <TabsTrigger value="settings">Ρυθμίσεις</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Το Προφίλ μου</CardTitle>
              <CardDescription>
                Διαχειριστείτε τις πληροφορίες του λογαριασμού σας
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="mt-2 w-full">
                    Αλλαγή Φωτογραφίας
                  </Button>
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ονοματεπώνυμο</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={user.email} readOnly />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Τηλέφωνο</Label>
                    <Input id="phone" placeholder="Προσθέστε τηλέφωνο" />
                  </div>
                  
                  <div className="pt-4">
                    <Button>Αποθήκευση Αλλαγών</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Τα Αγαπημένα μου</CardTitle>
              <CardDescription>
                Προϊόντα που έχετε αποθηκεύσει στα αγαπημένα σας
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Δεν έχετε προσθέσει ακόμα προϊόντα στα αγαπημένα σας.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Ρυθμίσεις Λογαριασμού</CardTitle>
              <CardDescription>
                Διαχειριστείτε τις ρυθμίσεις του λογαριασμού σας
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Αλλαγή Κωδικού</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Τρέχων Κωδικός</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Νέος Κωδικός</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Επιβεβαίωση Κωδικού</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="mt-2">Αλλαγή Κωδικού</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Γλώσσα & Τοποθεσία</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="language">Γλώσσα</Label>
                    <select id="language" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="el">Ελληνικά</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Χώρα</Label>
                    <select id="country" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="gr">Ελλάδα</option>
                      <option value="cy">Κύπρος</option>
                    </select>
                  </div>
                  <Button className="mt-2">Αποθήκευση</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-destructive">Διαγραφή Λογαριασμού</h3>
                <p className="text-sm text-muted-foreground">
                  Η διαγραφή του λογαριασμού σας είναι μόνιμη και θα αφαιρέσει όλα τα δεδομένα σας.
                </p>
                <Button variant="destructive">Διαγραφή Λογαριασμού</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountPage;
