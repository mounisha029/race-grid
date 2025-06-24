
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { User, Trophy, MessageSquare, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileData {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  favorite_driver_id: string;
  favorite_team_id: string;
  avatar_url: string;
  created_at: string;
}

interface UserProfileProps {
  userId?: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    postsCount: 0,
    commentsCount: 0,
    followersCount: 0,
    followingCount: 0
  });
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    favorite_driver_id: '',
    favorite_team_id: ''
  });

  const isOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchProfile();
      fetchStats();
    }
  }, [targetUserId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          display_name: data.display_name || '',
          bio: data.bio || '',
          favorite_driver_id: data.favorite_driver_id || '',
          favorite_team_id: data.favorite_team_id || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!targetUserId) return;

    try {
      const [postsResult, commentsResult, followersResult, followingResult] = await Promise.all([
        supabase.from('social_posts').select('id', { count: 'exact' }).eq('user_id', targetUserId),
        supabase.from('race_comments').select('id', { count: 'exact' }).eq('user_id', targetUserId),
        supabase.from('user_follows').select('id', { count: 'exact' }).eq('following_id', targetUserId),
        supabase.from('user_follows').select('id', { count: 'exact' }).eq('follower_id', targetUserId)
      ]);

      setStats({
        postsCount: postsResult.count || 0,
        commentsCount: commentsResult.count || 0,
        followersCount: followersResult.count || 0,
        followingCount: followingResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const followUser = async () => {
    if (!user || !targetUserId) return;

    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Now following user",
      });
      
      fetchStats();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-f1-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {profile?.display_name || user?.email}
                </CardTitle>
                <CardDescription>
                  Member since {new Date(profile?.created_at || '').toLocaleDateString()}
                </CardDescription>
                {profile?.bio && (
                  <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isOwnProfile ? (
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              ) : (
                <Button onClick={followUser}>
                  Follow
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {isEditing && (
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <Button onClick={updateProfile}>Save Changes</Button>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-f1-orange" />
            <div className="text-2xl font-bold">{stats.postsCount}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-f1-red" />
            <div className="text-2xl font-bold">{stats.commentsCount}</div>
            <div className="text-sm text-muted-foreground">Comments</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.followersCount}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{stats.followingCount}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Activity feed coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Posts history coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="following" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Following</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Following list coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
