
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/social/ProfileHeader";
import ProfileTabs from "../components/social/ProfileTabs";
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
      
      <ProfileTabs
        user={user}
        posts={posts}
        isOwnProfile={isOwnProfile}
        profileImage={profileImage}
        profile={profile}
        handleNewPost={handleNewPost}
        handleLikePost={handleLikePost}
      />
    </div>
  );
}
