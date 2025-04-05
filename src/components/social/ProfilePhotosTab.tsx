
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProfilePhotosTab = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Photos (0)</h3>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          No photos yet. Start sharing moments!
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePhotosTab;
