
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
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
  GraduationCap
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
import { supabase } from "@/integrations/supabase/client";

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

export default function SocialProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [profileImage, setProfileImage] = useState(user?.avatar || "");
  const [coverImage, setCoverImage] = useState("https://placehold.co/1200x400?text=Cover+Photo");
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    bio: "",
    location: "Athens, Greece",
    work: "BestPrice",
    education: "University of Athens"
  });
  
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  
  const { username } = useParams<{ username?: string }>();
  
  useEffect(() => {
    if (username && user?.username !== username) {
      setIsOwnProfile(false);
      fetchUserProfile(username);
    } else if (user) {
      setIsOwnProfile(true);
      fetchPosts(user.id);
      if (user.bio) setProfile(prev => ({ ...prev, bio: user.bio }));
      if (user.location) setProfile(prev => ({ ...prev, location: user.location }));
      if (user.avatar) setProfileImage(user.avatar);
    }
  }, [user, username]);
  
  const fetchUserProfile = async (username: string) => {
    setLoading(true);
    
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) throw error;
      
      if (profileData) {
        setProfileImage(profileData.profile_image_url || "");
        setCoverImage(profileData.cover_image_url || "https://placehold.co/1200x400?text=Cover+Photo");
        setProfile({
          bio: profileData.bio || "",
          location: profileData.location || "Athens, Greece",
          work: "BestPrice",
          education: "University of Athens"
        });
        
        fetchPosts(profileData.id);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user profile."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPosts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, display_name, profile_image_url),
          likes:likes (user_id),
          comments:comments (id)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const formattedPosts = data.map(post => ({
          id: post.id,
          content: post.content,
          timestamp: new Date(post.created_at),
          likes: Array.isArray(post.likes) ? post.likes.length : 0,
          comments: Array.isArray(post.comments) ? post.comments.length : 0,
          authorId: post.user_id,
          authorName: post.profiles?.display_name || 'Unknown User',
          authorAvatar: post.profiles?.profile_image_url,
          image: post.image_url
        }));
        
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  if (!user) {
    navigate("/account");
    return null;
  }
  
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-profile-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully."
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your profile picture."
      });
    }
  };
  
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-cover-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(fileName);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cover_image_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Cover photo updated",
        description: "Your cover photo has been updated successfully."
      });
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your cover photo."
      });
    }
  };
  
  const handleNewPost = async () => {
    if (!newPostContent.trim() || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPostContent
        })
        .select('*, profiles:user_id (username, display_name, profile_image_url)')
        .single();
        
      if (error) throw error;
      
      if (data) {
        const newPost: Post = {
          id: data.id,
          content: data.content,
          timestamp: new Date(data.created_at),
          likes: 0,
          comments: 0,
          authorId: data.user_id,
          authorName: data.profiles?.display_name || user.name,
          authorAvatar: data.profiles?.profile_image_url
        };
        
        setPosts([newPost, ...posts]);
        setNewPostContent("");
        
        toast({
          title: "Post created",
          description: "Your post has been published to your timeline."
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post."
      });
    }
  };
  
  const handleLikePost = async (postId: string) => {
    if (!user) return;
    
    try {
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingLike) {
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
          
        setPosts(
          posts.map(post => 
            post.id === postId 
              ? { ...post, likes: post.likes - 1 } 
              : post
          )
        );
      } else {
        await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
          
        setPosts(
          posts.map(post => 
            post.id === postId 
              ? { ...post, likes: post.likes + 1 } 
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="relative rounded-xl overflow-hidden mb-16 h-64">
        <img 
          src={coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover" 
        />
        {isOwnProfile && (
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute bottom-4 right-4 rounded-full"
            onClick={() => coverImageInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
        <input 
          type="file" 
          accept="image/*" 
          ref={coverImageInputRef}
          className="hidden" 
          onChange={handleCoverImageChange}
        />
        
        <div className="absolute -bottom-12 left-8">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={profileImage} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => profileImageInputRef.current?.click()}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
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
      
      <div className="flex justify-between items-start mb-8">
        <div className="ml-32">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" /> {profile.location}
            </div>
            <div className="flex items-center">
              <Briefcase className="h-3 w-3 mr-1" /> {profile.work}
            </div>
            <div className="flex items-center">
              <GraduationCap className="h-3 w-3 mr-1" /> {profile.education}
            </div>
          </div>
        </div>
        {!isOwnProfile && (
          <div className="flex gap-2">
            <Button>Add Friend</Button>
            <Button variant="outline">Message</Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
          <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
          <TabsTrigger value="friends" className="flex-1">Friends</TabsTrigger>
          <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="space-y-6">
          {isOwnProfile && (
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
          )}
          
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No posts yet.
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
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
            ))
          )}
        </TabsContent>
        
        <TabsContent value="about">
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
        </TabsContent>
        
        <TabsContent value="friends">
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
        </TabsContent>
        
        <TabsContent value="photos">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
