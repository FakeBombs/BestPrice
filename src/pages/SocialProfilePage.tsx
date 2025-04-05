
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/social/ProfileHeader";
import ProfileAboutTab from "../components/social/ProfileAboutTab";
import ProfileFriendsTab from "../components/social/ProfileFriendsTab";
import ProfilePhotosTab from "../components/social/ProfilePhotosTab";
import PostItem from "../components/social/post/PostItem";
import CreatePostForm from "../components/social/post/CreatePostForm";
import { useProfile } from "../components/social/hooks/useProfile";

export default function SocialProfilePage() {
  const { username } = useParams<{ username?: string }>();
  const {
    user,
    posts,
    profileImage,
    setProfileImage,
    coverImage,
    setCoverImage,
    isOwnProfile,
    profile,
    handleNewPost,
    handleLikePost
  } = useProfile(username);
  
  if (!user) {
    return null; // Will redirect via the useEffect in useProfile
  }
  
  return (
    <div className="container max-w-4xl py-8">
      <ProfileHeader 
        user={user}
        profile={profile}
        isOwnProfile={isOwnProfile}
        profileImage={profileImage}
        coverImage={coverImage}
        setProfileImage={setProfileImage}
        setCoverImage={setCoverImage}
      />
      
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
          <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
          <TabsTrigger value="friends" className="flex-1">Friends</TabsTrigger>
          <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="space-y-6">
          {isOwnProfile && (
            <CreatePostForm 
              user={user}
              profileImage={profileImage}
              onPost={handleNewPost}
            />
          )}
          
          {posts.length === 0 ? (
            <div className="bg-card p-6 rounded-md text-center text-muted-foreground">
              No posts yet.
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostItem 
                  key={post.id} 
                  post={post} 
                  onLike={handleLikePost} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="about">
          <ProfileAboutTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="friends">
          <ProfileFriendsTab />
        </TabsContent>
        
        <TabsContent value="photos">
          <ProfilePhotosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
