
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useDrivers } from '@/hooks/useDrivers';

interface DriverSelectionStepProps {
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  onDataUpdate: (data: any) => void;
}

const DriverSelectionStep = ({ onNext, onSkip, onBack, onDataUpdate }: DriverSelectionStepProps) => {
  const { data: drivers, isLoading } = useDrivers();
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  const handleDriverToggle = (driverId: string) => {
    setSelectedDrivers(prev => {
      const newSelection = prev.includes(driverId)
        ? prev.filter(id => id !== driverId)
        : [...prev, driverId];
      
      onDataUpdate({ favorite_drivers: newSelection });
      return newSelection;
    });
  };

  const handleNext = () => {
    onDataUpdate({ favorite_drivers: selectedDrivers });
    onNext();
  };

  if (isLoading) {
    return (
      <Card className="racing-card">
        <CardHeader>
          <CardTitle>Choose Your Favorite Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2" />
                <div className="h-4 bg-muted rounded mb-1" />
                <div className="h-3 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="racing-card">
      <CardHeader>
        <CardTitle>Choose Your Favorite Drivers</CardTitle>
        <p className="text-muted-foreground">
          Select the drivers you want to follow. You can change this later.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {drivers?.map((driver) => (
            <div
              key={driver.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedDrivers.includes(driver.id)
                  ? 'border-f1-red bg-f1-red/5'
                  : 'border-border hover:border-f1-red/50'
              }`}
              onClick={() => handleDriverToggle(driver.id)}
            >
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-2">
                  <AvatarImage src={driver.profile_image_url} />
                  <AvatarFallback>
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-sm">
                  {driver.first_name} {driver.last_name}
                </h3>
                <p className="text-xs text-muted-foreground">#{driver.driver_number}</p>
                {selectedDrivers.includes(driver.id) && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Selected
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedDrivers.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            {selectedDrivers.length} driver{selectedDrivers.length !== 1 ? 's' : ''} selected
          </div>
        )}
        
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

export default DriverSelectionStep;
