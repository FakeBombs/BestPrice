
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useProfile = (username?: string) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<any[]>([]);
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
      // Update the query to use a different approach for the join
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          user_id,
          image_url,
          profiles:user_id(display_name, profile_image_url),
          likes:likes(user_id),
          comments:comments(id)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        // Type assertion to handle the data returned from Supabase
        const formattedPosts = (data as any).map((post: any) => {
          // Handle potential null or undefined profiles
          const profileData = post.profiles || { display_name: 'Unknown User' }; 
          return {
            id: post.id,
            content: post.content,
            timestamp: new Date(post.created_at),
            likes: Array.isArray(post.likes) ? post.likes.length : 0,
            comments: Array.isArray(post.comments) ? post.comments.length : 0,
            authorId: post.user_id,
            authorName: profileData.display_name || 'Unknown User',
            authorAvatar: profileData.profile_image_url,
            image: post.image_url || undefined
          };
        });
        
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  const handleNewPost = async (content: string) => {
    if (!content.trim() || !user) return;
    
    try {
      const postData = {
        user_id: user.id,
        content: content
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select('*, profiles:user_id (display_name, profile_image_url)')
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Handle potential null values from the response
        const profileData = (data as any).profiles || {};
        
        const newPost = {
          id: data.id,
          content: data.content,
          timestamp: new Date(data.created_at),
          likes: 0,
          comments: 0,
          authorId: data.user_id,
          authorName: profileData.display_name || user.name,
          authorAvatar: profileData.profile_image_url
        };
        
        setPosts([newPost, ...posts]);
        
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
        const likeData = {
          post_id: postId,
          user_id: user.id
        };
        
        await supabase
          .from('likes')
          .insert(likeData);
          
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
  
  if (!user) {
    navigate("/account");
    return { user: null };
  }
  
  return {
    user,
    posts,
    profileImage,
    setProfileImage,
    coverImage,
    setCoverImage,
    isOwnProfile,
    loading,
    profile,
    handleNewPost,
    handleLikePost
  };
};
