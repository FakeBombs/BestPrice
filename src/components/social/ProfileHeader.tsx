
import { useState, useRef } from "react";
import { MapPin, Briefcase, GraduationCap, Camera, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  bio: string;
  location: string;
  work: string;
  education: string;
}

interface ProfileHeaderProps {
  user: any;
  profile: ProfileData;
  isOwnProfile: boolean;
  profileImage: string;
  coverImage: string;
  setCoverImage: (url: string) => void;
  setProfileImage: (url: string) => void;
}

const ProfileHeader = ({
  user,
  profile,
  isOwnProfile,
  profileImage,
  coverImage,
  setCoverImage,
  setProfileImage
}: ProfileHeaderProps) => {
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  
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
  
  return (
    <>
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
              <AvatarFallback>{user?.name.charAt(0) || '?'}</AvatarFallback>
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
          <h1 className="text-3xl font-bold">{user?.name || 'User Profile'}</h1>
          <p className="text-muted-foreground">{user?.email || ''}</p>
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
    </>
  );
};

export default ProfileHeader;
