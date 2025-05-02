
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function useProfile(username?: string) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  
  useEffect(() => {
    // If no username provided, check if current user is logged in
    if (!username) {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      // Viewing own profile
      setIsOwnProfile(true);
      setUser(currentUser);
      
      // Fetch additional profile data
      fetchProfileData(currentUser.id);
    } else {
      // Try to find user by username
      fetchUserByUsername(username);
    }
  }, [username, currentUser, navigate]);
  
  // Fetch user by username
  const fetchUserByUsername = async (username: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error || !data) {
        console.error("Error fetching user:", error);
        navigate('/not-found');
        return;
      }
      
      const isOwn = currentUser && data.id === currentUser.id;
      setIsOwnProfile(isOwn);
      setUser({
        id: data.id,
        name: data.display_name || 'Anonymous',
      });
      
      fetchProfileData(data.id);
    } catch (error) {
      console.error("Error:", error);
      navigate('/not-found');
    }
  };
  
  // Fetch profile data
  const fetchProfileData = async (userId: string) => {
    setIsLoading(true);
    
    try {
      // Get user profile details
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      setProfile(profileData);
      setProfileImage(profileData.profile_image_url || "");
      setCoverImage(profileData.cover_image_url || "");
      
      // Get user posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      // Transform posts for display
      const transformedPosts = postsData.map(post => ({
        id: post.id,
        content: post.content,
        timestamp: new Date(post.created_at),
        likes: 0, // We'll fetch this separately
        comments: 0, // We'll fetch this separately
        authorId: userId,
        authorName: profileData.display_name || 'Anonymous',
        authorAvatar: profileData.profile_image_url,
        image: post.image_url
      }));
      
      setPosts(transformedPosts);
    } catch (error: any) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle new post creation
  const handleNewPost = async (content: string, image?: File | null): Promise<void> => {
    if (!user) return;
    
    try {
      const post = {
        user_id: user.id,
        content,
        image_url: null // We'll update this if there's an image
      };
      
      // If there's an image, upload it first
      if (image) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(fileName, image);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post_images')
          .getPublicUrl(fileName);
          
        post.image_url = publicUrl;
      }
      
      // Create the post
      const { data, error } = await supabase.from('posts').insert(post).select();
      
      if (error) throw error;
      
      // Add the new post to state
      if (data && data[0]) {
        const newPost = {
          id: data[0].id,
          content: data[0].content,
          timestamp: new Date(data[0].created_at),
          likes: 0,
          comments: 0,
          authorId: user.id,
          authorName: user.name,
          authorAvatar: profileImage,
          image: data[0].image_url
        };
        
        setPosts(prevPosts => [newPost, ...prevPosts]);
        
        toast({
          title: "Post Created",
          description: "Your post has been published."
        });
      }
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle post like
  const handleLikePost = async (postId: string): Promise<void> => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to like posts.",
      });
      return;
    }
    
    try {
      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select()
        .eq('post_id', postId)
        .eq('user_id', currentUser.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingLike) {
        // Unlike
        const { error: unlikeError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
          
        if (unlikeError) throw unlikeError;
        
        // Update UI
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likes: Math.max(0, post.likes - 1) } 
              : post
          )
        );
      } else {
        // Like
        const { error: likeError } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: currentUser.id });
          
        if (likeError) throw likeError;
        
        // Update UI
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likes: post.likes + 1 } 
              : post
          )
        );
      }
    } catch (error: any) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return {
    user,
    profile,
    posts,
    isLoading,
    profileImage, 
    setProfileImage,
    coverImage,
    setCoverImage,
    isOwnProfile,
    handleNewPost,
    handleLikePost
  };
}
