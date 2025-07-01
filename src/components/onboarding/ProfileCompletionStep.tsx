
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';

interface ProfileCompletionStepProps {
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  onDataUpdate: (data: any) => void;
}

const ProfileCompletionStep = ({ onNext, onSkip, onBack, onDataUpdate }: ProfileCompletionStepProps) => {
  const [profileData, setProfileData] = useState({
    display_name: '',
    bio: '',
    profile_picture_url: ''
  });

  const updateProfileData = (key: string, value: string) => {
    const newData = { ...profileData, [key]: value };
    setProfileData(newData);
    onDataUpdate(newData);
  };

  const handleNext = () => {
    onDataUpdate(profileData);
    onNext();
  };

  return (
    <Card className="racing-card">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <p className="text-muted-foreground">
          Add a personal touch to your F1 Box Box profile.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <ProfilePictureUpload
            currentImageUrl={profileData.profile_picture_url}
            onImageUpload={(url) => updateProfileData('profile_picture_url', url)}
            size="lg"
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="How should others see you?"
              value={profileData.display_name}
              onChange={(e) => updateProfileData('display_name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your F1 passion..."
              value={profileData.bio}
              onChange={(e) => updateProfileData('bio', e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <div className="space-x-2">
            <Button variant="ghost" onClick={onSkip}>
              Skip
            </Button>
            <Button onClick={handleNext} className="speed-button">
              Complete Setup 🏁
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionStep;
