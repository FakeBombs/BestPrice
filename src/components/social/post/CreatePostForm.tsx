
import { useState } from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus } from "lucide-react";

interface CreatePostFormProps {
  user: any;
  profileImage: string;
  onPost: (content: string) => Promise<void>;
}

const CreatePostForm = ({ user, profileImage, onPost }: CreatePostFormProps) => {
  const [newPostContent, setNewPostContent] = useState("");

  const handleSubmit = async () => {
    if (newPostContent.trim()) {
      await onPost(newPostContent);
      setNewPostContent("");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={profileImage} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <textarea 
            className="flex-1 resize-none border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          ></textarea>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <ImagePlus className="h-4 w-4 mr-2" />
            Photo
          </Button>
        </div>
        <Button 
          disabled={!newPostContent.trim()} 
          onClick={handleSubmit}
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePostForm;
