
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Share2, Camera, Video, Trophy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialSharingProps {
  raceId?: string;
  raceName?: string;
}

const SocialSharing = ({ raceId, raceName }: SocialSharingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);

  const sharePost = async () => {
    if (!user || !newPost.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('social_posts')
        .insert({
          content: newPost.trim(),
          race_id: raceId,
          user_id: user.id
        });

      if (error) throw error;

      setNewPost('');
      toast({
        title: "Success",
        description: "Post shared successfully",
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const shareToSocial = (platform: string, content: string) => {
    const encodedContent = encodeURIComponent(content);
    const url = window.location.href;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedContent}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your F1 Moment
          </CardTitle>
          <CardDescription>
            Share race moments, predictions, photos, and videos with the community
          </CardDescription>
        </CardHeader>
        
        {user && (
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your F1 moment..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {raceName && `Sharing for: ${raceName}`}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial('twitter', newPost)}
                  disabled={!newPost.trim()}
                >
                  Share to Twitter
                </Button>
                <Button 
                  onClick={sharePost}
                  disabled={!newPost.trim() || loading}
                >
                  {loading ? "Sharing..." : "Share"}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Community Highlights</CardTitle>
          <CardDescription>
            See what the F1 community is sharing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-f1-red/10 to-f1-orange/10 p-4 rounded-lg">
              <Badge className="mb-2">Trending Moment</Badge>
              <p className="text-sm">"Hamilton's incredible overtake in turn 3!"</p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>@f1fan2025</span>
                <span>2.3k likes</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-lg">
              <Badge variant="secondary" className="mb-2">Hot Prediction</Badge>
              <p className="text-sm">"Verstappen will win by 15+ seconds"</p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>@racingexpert</span>
                <span>1.8k shares</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Share Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => shareToSocial('twitter', 'Watching #F1 live! 🏎️')}
            >
              <Share2 className="w-6 h-6 mb-2" />
              Twitter
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => shareToSocial('facebook', 'Amazing F1 race happening now!')}
            >
              <Share2 className="w-6 h-6 mb-2" />
              Facebook
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => shareToSocial('linkedin', 'F1 racing excitement!')}
            >
              <Share2 className="w-6 h-6 mb-2" />
              LinkedIn
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <Camera className="w-6 h-6 mb-2" />
              Take Photo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialSharing;
