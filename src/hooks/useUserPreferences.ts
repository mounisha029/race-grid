
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserPreferences {
  id: string;
  user_id: string;
  notifications: boolean;
  timezone: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseUserPreferences {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  timezone: string;
  dark_mode: boolean;
  theme?: string;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const mapDatabaseToInterface = (dbPrefs: DatabaseUserPreferences): UserPreferences => {
    return {
      id: dbPrefs.id,
      user_id: dbPrefs.user_id,
      notifications: dbPrefs.notifications_enabled,
      timezone: dbPrefs.timezone,
      theme: dbPrefs.theme || (dbPrefs.dark_mode ? 'dark' : 'light'),
      created_at: dbPrefs.created_at,
      updated_at: dbPrefs.updated_at
    };
  };

  const fetchPreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const mappedPreferences = mapDatabaseToInterface(data);
        setPreferences(mappedPreferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return false;

    try {
      // Map interface fields back to database fields
      const dbUpdates: any = {};
      
      if (updates.notifications !== undefined) {
        dbUpdates.notifications_enabled = updates.notifications;
      }
      
      if (updates.theme !== undefined) {
        dbUpdates.theme = updates.theme;
        dbUpdates.dark_mode = updates.theme === 'dark';
      }
      
      if (updates.timezone !== undefined) {
        dbUpdates.timezone = updates.timezone;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const mappedPreferences = mapDatabaseToInterface(data);
      setPreferences(mappedPreferences);
      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    refreshPreferences: fetchPreferences
  };
};
