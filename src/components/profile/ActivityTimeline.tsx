
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, MessageSquare, Eye, Star } from 'lucide-react';
import { useUserActivity } from '@/hooks/useUserActivity';

const ActivityTimeline = () => {
  const { activities, loading } = useUserActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <Trophy className="w-4 h-4 text-f1-orange" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-f1-red" />;
      case 'race_view':
        return <Eye className="w-4 h-4 text-blue-500" />;
      default:
        return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityDescription = (activity: any) => {
    switch (activity.activity_type) {
      case 'prediction':
        return `Made a prediction for ${activity.activity_data?.race_name || 'a race'}`;
      case 'comment':
        return `Commented on ${activity.activity_data?.race_name || 'a race'}`;
      case 'race_view':
        return `Viewed ${activity.activity_data?.race_name || 'a race'}`;
      default:
        return activity.activity_type.replace('_', ' ');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-1" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No activity yet. Start engaging with races to see your activity here!
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {getActivityDescription(activity)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
