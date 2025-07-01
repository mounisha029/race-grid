
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useToast } from "@/hooks/use-toast";
import { User, Trophy, MessageSquare, Users, Settings, Shield, Bell } from "lucide-react";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import UserStatsDashboard from "@/components/profile/UserStatsDashboard";
import ActivityTimeline from "@/components/profile/ActivityTimeline";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

interface UserProfileProps {
  userId?: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const { user } = useAuth();
  const { preferences, loading, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    profile_picture_url: '',
    notifications_enabled: true,
    email_notifications: false,
    push_notifications: true,
    timezone: 'UTC'
  });

  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    if (preferences) {
      setFormData({
        display_name: preferences.display_name || '',
        bio: preferences.bio || '',
        profile_picture_url: preferences.profile_picture_url || '',
        notifications_enabled: preferences.notifications_enabled ?? true,
        email_notifications: preferences.email_notifications ?? false,
        push_notifications: preferences.push_notifications ?? true,
        timezone: preferences.timezone || 'UTC'
      });

      // Show onboarding if not completed
      if (!preferences.onboarding_completed && isOwnProfile) {
        setShowOnboarding(true);
      }
    }
  }, [preferences, isOwnProfile]);

  // If user is not logged in, show registration prompt
  if (!user) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="racing-text text-2xl">Join F1 Box Box</CardTitle>
          <CardDescription>
            Create an account to track your favorite races and interact with the community
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild className="speed-button">
            <a href="/register">Create Account</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show onboarding flow if not completed
  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  const updateProfile = async () => {
    try {
      await updatePreferences(formData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
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
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <ProfilePictureUpload
                currentImageUrl={formData.profile_picture_url}
                onImageUpload={(url) => setFormData({ ...formData, profile_picture_url: url })}
                size="lg"
              />
              <div>
                <CardTitle className="text-2xl">
                  {formData.display_name || user?.email}
                </CardTitle>
                <CardDescription>
                  Member since {new Date().toLocaleDateString()}
                </CardDescription>
                {formData.bio && (
                  <p className="text-sm text-muted-foreground mt-2">{formData.bio}</p>
                )}
              </div>
            </div>
            
            {isOwnProfile && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowOnboarding(true)}
                  size="sm"
                >
                  Restart Setup
                </Button>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            )}
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
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
            
            <Button onClick={updateProfile} className="speed-button">
              Save Changes
            </Button>
          </CardContent>
        )}
      </Card>

      {/* User Statistics */}
      <UserStatsDashboard />

      {/* Profile Tabs */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <ActivityTimeline />
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get real-time race updates</p>
                </div>
                <Switch
                  id="notifications"
                  checked={formData.push_notifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, push_notifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Weekly summaries and updates</p>
                </div>
                <Switch
                  id="email"
                  checked={formData.email_notifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, email_notifications: checked })}
                />
              </div>

              <Button onClick={updateProfile} className="speed-button">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Privacy settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Account Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Account management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
