
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flag, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import WelcomeStep from './WelcomeStep';
import DriverSelectionStep from './DriverSelectionStep';
import TeamSelectionStep from './TeamSelectionStep';
import NotificationPreferencesStep from './NotificationPreferencesStep';
import ProfileCompletionStep from './ProfileCompletionStep';

const ONBOARDING_STEPS = [
  'welcome',
  'drivers',
  'teams',
  'notifications',
  'profile'
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { user } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<any>({});

  useEffect(() => {
    if (preferences?.onboarding_completed) {
      onComplete();
    }
  }, [preferences, onComplete]);

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateStepData = (step: string, data: any) => {
    setStepData(prev => ({ ...prev, [step]: data }));
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      await updatePreferences({
        onboarding_completed: true,
        ...stepData.drivers,
        ...stepData.teams,
        ...stepData.notifications,
        ...stepData.profile
      });
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const renderCurrentStep = () => {
    const stepName = ONBOARDING_STEPS[currentStep];
    
    switch (stepName) {
      case 'welcome':
        return <WelcomeStep onNext={handleNext} />;
      case 'drivers':
        return (
          <DriverSelectionStep
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            onDataUpdate={(data) => updateStepData('drivers', data)}
          />
        );
      case 'teams':
        return (
          <TeamSelectionStep
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            onDataUpdate={(data) => updateStepData('teams', data)}
          />
        );
      case 'notifications':
        return (
          <NotificationPreferencesStep
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            onDataUpdate={(data) => updateStepData('notifications', data)}
          />
        );
      case 'profile':
        return (
          <ProfileCompletionStep
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            onDataUpdate={(data) => updateStepData('profile', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-f1-black via-slate-900 to-f1-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-f1-red/5 via-transparent to-f1-orange/5" />
      
      <div className="w-full max-w-2xl relative">
        {/* Progress Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-racing-gradient rounded-full flex items-center justify-center">
                <Flag className="w-5 h-5 text-white" />
              </div>
              <span className="racing-text text-xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
                Welcome to F1 Box Box
              </span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </p>
          </CardHeader>
        </Card>

        {/* Current Step Content */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default OnboardingFlow;
