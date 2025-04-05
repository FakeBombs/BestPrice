
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProfileFriendsTab = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Friends (0)</h3>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          No friends found. Start connecting with others!
        </div>
        <Button variant="outline" className="w-full mt-6">
          Find Friends
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileFriendsTab;
