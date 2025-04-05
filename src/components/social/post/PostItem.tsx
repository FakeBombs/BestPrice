
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, Share, MoreHorizontal } from "lucide-react";

interface Post {
  id: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  image?: string;
}

interface PostItemProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
}

const PostItem = ({ post, onLike }: PostItemProps) => {
  return (
    <Card key={post.id}>
      <CardHeader>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.authorName}</p>
            <p className="text-xs text-muted-foreground">
              {post.timestamp.toLocaleDateString()}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <div className="mt-4">
            <img 
              src={post.image} 
              alt="Post" 
              className="rounded-lg w-full" 
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onLike(post.id)}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {post.likes} Likes
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            {post.comments} Comments
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostItem;
