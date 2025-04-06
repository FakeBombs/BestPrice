
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileAboutTab from "./ProfileAboutTab";
import ProfileFriendsTab from "./ProfileFriendsTab";
import ProfilePhotosTab from "./ProfilePhotosTab";
import PostItem from "./post/PostItem";
import CreatePostForm from "./post/CreatePostForm";

interface ProfileTabsProps {
  user: any;
  posts: any[];
  isOwnProfile: boolean;
  profileImage: string;
  profile: any;
  handleNewPost: (content: string, image?: File | null) => void;
  handleLikePost: (postId: string) => void;
}

const ProfileTabs = ({
  user,
  posts,
  isOwnProfile,
  profileImage,
  profile,
  handleNewPost,
  handleLikePost
}: ProfileTabsProps) => {
  return (
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
  );
};

export default ProfileTabs;
