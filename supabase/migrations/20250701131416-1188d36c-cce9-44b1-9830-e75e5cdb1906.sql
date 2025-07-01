
-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', true);

-- Create storage policies for profile pictures
CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view all profile pictures" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can update their own profile pictures" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Update user_preferences table with additional fields
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS favorite_drivers UUID[],
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "activity_visibility": "friends"}',
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;

-- Create user_activity table for tracking user actions
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user_activity table
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_activity
CREATE POLICY "Users can view their own activity" ON user_activity
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity" ON user_activity
FOR INSERT WITH CHECK (true);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_data JSONB,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Enable RLS on user_achievements table
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage achievements" ON user_achievements
FOR ALL USING (true);

-- Create user_statistics view
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
  up.user_id,
  up.created_at as join_date,
  COUNT(DISTINCT ua.id) FILTER (WHERE ua.activity_type = 'prediction') as total_predictions,
  COUNT(DISTINCT ua.id) FILTER (WHERE ua.activity_type = 'comment') as total_comments,
  COUNT(DISTINCT ua.id) FILTER (WHERE ua.activity_type = 'race_view') as races_viewed,
  COUNT(DISTINCT ach.id) as total_achievements
FROM user_profiles up
LEFT JOIN user_activity ua ON up.user_id = ua.user_id
LEFT JOIN user_achievements ach ON up.user_id = ach.user_id
GROUP BY up.user_id, up.created_at;

-- Create function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_activity_data JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO user_activity (user_id, activity_type, activity_data)
  VALUES (p_user_id, p_activity_type, p_activity_data)
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Create function to award achievements
CREATE OR REPLACE FUNCTION award_achievement(
  p_user_id UUID,
  p_achievement_type TEXT,
  p_achievement_data JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_achievements (user_id, achievement_type, achievement_data)
  VALUES (p_user_id, p_achievement_type, p_achievement_data)
  ON CONFLICT (user_id, achievement_type) DO NOTHING;
  
  RETURN FOUND;
END;
$$;

-- Create trigger to automatically award first profile completion achievement
CREATE OR REPLACE FUNCTION check_profile_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Award achievement when onboarding is completed
  IF NEW.onboarding_completed = true AND (OLD.onboarding_completed IS NULL OR OLD.onboarding_completed = false) THEN
    PERFORM award_achievement(NEW.user_id, 'profile_completed', '{"completed_at": "' || now() || '"}');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_profile_completion
  AFTER UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION check_profile_completion();
