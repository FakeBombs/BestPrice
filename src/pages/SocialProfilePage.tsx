
import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  Pencil, 
  ImagePlus, 
  MessageCircle, 
  ThumbsUp, 
  Share, 
  MoreHorizontal,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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

// Mock data for posts
const mockPosts: Post[] = [
  {
    id: "p1",
    content: "Just updated my profile on BestPrice! Loving the new features.",
    timestamp: new Date(2025, 3, 3),
    likes: 14,
    comments: 3,
    authorId: "user1",
    authorName: "John Doe",
    authorAvatar: `https://placehold.co/100x100?text=J`
  },
  {
    id: "p2",
    content: "Found an amazing deal on the new smartphone. Check it out on BestPrice!",
    timestamp: new Date(2025, 3, 1),
    likes: 27,
    comments: 5,
    authorId: "user1",
    authorName: "John Doe",
    authorAvatar: `https://placehold.co/100x100?text=J`,
    image: "https://placehold.co/600x400?text=Smartphone+Deal"
  }
];

export default function SocialProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [profileImage, setProfileImage] = useState(user?.avatar || "");
  const [coverImage, setCoverImage] = useState("https://placehold.co/1200x400?text=Cover+Photo");
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  if (!user) {
    navigate("/account");
    return null;
  }
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully."
      });
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Cover photo updated",
        description: "Your cover photo has been updated successfully."
      });
    }
  };
  
  const handleNewPost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: `p${Date.now()}`,
      content: newPostContent,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: profileImage
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    
    toast({
      title: "Post created",
      description: "Your post has been published to your timeline."
    });
  };
  
  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      )
    );
  };
  
  return (
    <div className="container max-w-4xl py-8">
      {/* Cover Photo Section */}
      <div className="relative rounded-xl overflow-hidden mb-16 h-64">
        <img 
          src={coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover" 
        />
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute bottom-4 right-4 rounded-full"
          onClick={() => coverImageInputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
        </Button>
        <input 
          type="file" 
          accept="image/*" 
          ref={coverImageInputRef}
          className="hidden" 
          onChange={handleCoverImageChange}
        />
        
        {/* Profile Picture */}
        <div className="absolute -bottom-12 left-8">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={profileImage} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => profileImageInputRef.current?.click()}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <input 
              type="file" 
              accept="image/*" 
              ref={profileImageInputRef}
              className="hidden" 
              onChange={handleProfileImageChange}
            />
          </div>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="flex justify-between items-start mb-8">
        <div className="ml-32">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" /> Athens, Greece
            </div>
            <div className="flex items-center">
              <Briefcase className="h-3 w-3 mr-1" /> BestPrice
            </div>
            <div className="flex items-center">
              <GraduationCap className="h-3 w-3 mr-1" /> University of Athens
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button>Add Friend</Button>
          <Button variant="outline">Message</Button>
        </div>
      </div>
      
      {/* Tabs and Content */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
          <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
          <TabsTrigger value="friends" className="flex-1">Friends</TabsTrigger>
          <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
        </TabsList>
        
        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          {/* Create Post */}
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
                onClick={handleNewPost}
              >
                Post
              </Button>
            </CardFooter>
          </Card>
          
          {/* Posts */}
          {posts.map((post) => (
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
                    onClick={() => handleLikePost(post.id)}
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
          ))}
        </TabsContent>
        
        {/* About Tab */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">About Me</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Bio</h4>
                  <p className="text-muted-foreground">Tech enthusiast and deal hunter. Always looking for the best prices on gadgets and electronics.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <p className="text-muted-foreground">Athens, Greece</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Work</h4>
                  <p className="text-muted-foreground">Product Manager at BestPrice</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Education</h4>
                  <p className="text-muted-foreground">University of Athens, Computer Science</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Friends Tab */}
        <TabsContent value="friends">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold">Friends (142)</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-2">
                      <AvatarImage src={`https://placehold.co/100x100?text=${String.fromCharCode(65 + i)}`} />
                      <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-center">{`Friend ${i + 1}`}</p>
                    <p className="text-xs text-muted-foreground">12 mutual friends</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                See All Friends
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Photos Tab */}
        <TabsContent value="photos">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold">Photos (24)</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square relative group overflow-hidden rounded-md">
                    <img 
                      src={`https://placehold.co/300x300?text=Photo+${i+1}`} 
                      alt={`Photo ${i+1}`}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-black/20">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                See All Photos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
