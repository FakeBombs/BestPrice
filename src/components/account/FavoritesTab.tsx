
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FavoritesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Favorites</CardTitle>
        <CardDescription>
          Manage your saved products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">You haven't saved any products yet.</p>
      </CardContent>
    </Card>
  );
};

export default FavoritesTab;
