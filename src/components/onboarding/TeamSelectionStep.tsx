
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTeams } from '@/hooks/useTeams';

interface TeamSelectionStepProps {
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  onDataUpdate: (data: any) => void;
}

const TeamSelectionStep = ({ onNext, onSkip, onBack, onDataUpdate }: TeamSelectionStepProps) => {
  const { data: teams, isLoading } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
    onDataUpdate({ favorite_team_id: teamId });
  };

  const handleNext = () => {
    onDataUpdate({ favorite_team_id: selectedTeam });
    onNext();
  };

  if (isLoading) {
    return (
      <Card className="racing-card">
        <CardHeader>
          <CardTitle>Choose Your Favorite Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded mb-1" />
                    <div className="h-3 bg-muted rounded" />
                  </div>
                </div>
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
        <CardTitle>Choose Your Favorite Team</CardTitle>
        <p className="text-muted-foreground">
          Select the team you want to follow throughout the season.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams?.map((team) => (
            <div
              key={team.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedTeam === team.id
                  ? 'border-f1-red bg-f1-red/5'
                  : 'border-border hover:border-f1-red/50'
              }`}
              onClick={() => handleTeamSelect(team.id)}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: team.primary_color || '#1f1f1f' }}
                >
                  {team.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">{team.full_name}</p>
                  {selectedTeam === team.id && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
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

export default TeamSelectionStep;
