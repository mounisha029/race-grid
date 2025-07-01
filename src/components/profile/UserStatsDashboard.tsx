
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, MessageSquare, Eye, Calendar } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  join_date: string;
  total_predictions: number;
  total_comments: number;
  races_viewed: number;
  total_achievements: number;
}

const UserStatsDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-muted rounded mx-auto mb-2" />
              <div className="h-6 bg-muted rounded mb-1" />
              <div className="h-4 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Member Since',
      value: stats?.join_date ? new Date(stats.join_date).toLocaleDateString() : 'Recent',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      title: 'Predictions',
      value: stats?.total_predictions || 0,
      icon: Trophy,
      color: 'text-f1-orange'
    },
    {
      title: 'Comments',
      value: stats?.total_comments || 0,
      icon: MessageSquare,
      color: 'text-f1-red'
    },
    {
      title: 'Races Viewed',
      value: stats?.races_viewed || 0,
      icon: Eye,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserStatsDashboard;
