
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  commentsCount: number;
}

export const useSocial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<SocialStats>({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    commentsCount: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSocialStats();
    }
  }, [user]);

  const fetchSocialStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [postsResult, followersResult, followingResult, commentsResult] = await Promise.all([
        supabase
          .from('social_posts')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),
        supabase
          .from('user_follows')
          .select('id', { count: 'exact' })
          .eq('following_id', user.id),
        supabase
          .from('user_follows')
          .select('id', { count: 'exact' })
          .eq('follower_id', user.id),
        supabase
          .from('race_comments')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
      ]);

      setStats({
        postsCount: postsResult.count || 0,
        followersCount: followersResult.count || 0,
        followingCount: followingResult.count || 0,
        commentsCount: commentsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching social stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: user.id,
          following_id: userId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Now following user",
      });

      fetchSocialStats();
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
      return false;
    }
  };

  const unfollowUser = async (userId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Unfollowed user",
      });

      fetchSocialStats();
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    stats,
    loading,
    followUser,
    unfollowUser,
    refreshStats: fetchSocialStats
  };
};
