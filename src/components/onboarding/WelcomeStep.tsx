
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag, Trophy, Users, Bell } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const features = [
    {
      icon: Trophy,
      title: 'Track Your Favorites',
      description: 'Follow your favorite drivers and teams throughout the season'
    },
    {
      icon: Users,
      title: 'Join the Community',
      description: 'Connect with fellow F1 fans and share your predictions'
    },
    {
      icon: Bell,
      title: 'Stay Updated',
      description: 'Get notified about race results and breaking F1 news'
    }
  ];

  return (
    <Card className="racing-card">
      <CardHeader className="text-center">
        <div className="w-20 h-20 bg-racing-gradient rounded-full flex items-center justify-center mx-auto mb-4">
          <Flag className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="racing-text text-3xl">Welcome to F1 Box Box!</CardTitle>
        <p className="text-muted-foreground text-lg">
          Your ultimate Formula 1 companion for tracking races, drivers, and connecting with the community.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
              <feature.icon className="w-6 h-6 text-f1-red mt-1" />
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-4">
          <Button onClick={onNext} className="speed-button w-full md:w-auto px-8">
            Let's Get Started! 🏁
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeStep;
