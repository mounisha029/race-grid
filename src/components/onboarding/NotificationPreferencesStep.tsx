
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, Clock } from 'lucide-react';

interface NotificationPreferencesStepProps {
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  onDataUpdate: (data: any) => void;
}

const NotificationPreferencesStep = ({ onNext, onSkip, onBack, onDataUpdate }: NotificationPreferencesStepProps) => {
  const [preferences, setPreferences] = useState({
    notifications_enabled: true,
    email_notifications: false,
    push_notifications: true,
    timezone: 'UTC'
  });

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'British Time (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  const updatePreference = (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    onDataUpdate(newPreferences);
  };

  const handleNext = () => {
    onDataUpdate(preferences);
    onNext();
  };

  return (
    <Card className="racing-card">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <p className="text-muted-foreground">
          Customize how you want to stay updated with F1 news and race information.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-f1-red" />
              <div>
                <Label htmlFor="notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get real-time race updates</p>
              </div>
            </div>
            <Switch
              id="notifications"
              checked={preferences.push_notifications}
              onCheckedChange={(checked) => updatePreference('push_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-f1-red" />
              <div>
                <Label htmlFor="email">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Weekly race summaries and updates</p>
              </div>
            </div>
            <Switch
              id="email"
              checked={preferences.email_notifications}
              onCheckedChange={(checked) => updatePreference('email_notifications', checked)}
            />
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="w-5 h-5 text-f1-red" />
              <Label>Timezone</Label>
            </div>
            <Select
              value={preferences.timezone}
              onValueChange={(value) => updatePreference('timezone', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferencesStep;
