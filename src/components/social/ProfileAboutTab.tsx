
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProfileData {
  bio: string;
  location: string;
  work: string;
  education: string;
}

interface ProfileAboutTabProps {
  profile: ProfileData;
}

const ProfileAboutTab = ({ profile }: ProfileAboutTabProps) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">About Me</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Bio</h4>
            <p className="text-muted-foreground">{profile.bio || "Tech enthusiast and deal hunter. Always looking for the best prices on gadgets and electronics."}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Location</h4>
            <p className="text-muted-foreground">{profile.location}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Work</h4>
            <p className="text-muted-foreground">{profile.work}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Education</h4>
            <p className="text-muted-foreground">{profile.education}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAboutTab;
