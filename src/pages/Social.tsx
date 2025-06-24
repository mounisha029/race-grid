
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthProvider";
import UserProfile from "@/components/social/UserProfile";
import RaceDiscussion from "@/components/social/RaceDiscussion";
import SocialSharing from "@/components/social/SocialSharing";
import CommunityPolls from "@/components/social/CommunityPolls";
import Login from "@/pages/Login";
import { Users, MessageSquare, Share2, BarChart3, User } from "lucide-react";

const Social = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-f1-red"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="racing-text text-3xl font-bold bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
            F1 Social Hub
          </h1>
          <p className="text-muted-foreground">
            Connect with the F1 community, share moments, and discuss races
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="sharing" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </TabsTrigger>
          <TabsTrigger value="polls" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Polls
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <UserProfile />
        </TabsContent>

        <TabsContent value="discussions" className="space-y-4">
          <RaceDiscussion 
            raceId="current-race" 
            raceName="Current Race Discussion" 
          />
        </TabsContent>

        <TabsContent value="sharing" className="space-y-4">
          <SocialSharing />
        </TabsContent>

        <TabsContent value="polls" className="space-y-4">
          <CommunityPolls />
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Community Features</h3>
            <p className="text-muted-foreground">
              Discover other F1 fans, follow users, and explore trending content
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Social;
