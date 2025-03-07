import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  isOptional?: boolean;
}

interface WizardProps {
  steps: Step[];
  onComplete: () => void;
  onCancel?: () => void;
  initialStep?: number;
  className?: string;
}

interface StepIndicatorProps {
  step: Step;
  index: number;
  currentStep: number;
  onClick: () => void;
}

function StepIndicator({ step, index, currentStep, onClick }: StepIndicatorProps) {
  const isCompleted = index < currentStep;
  const isCurrent = index === currentStep;

  return (
    <div className="flex items-center">
      {index > 0 && (
        <div
          className={cn(
            'h-1 w-16',
            isCompleted ? 'bg-primary' : 'bg-border'
          )}
        />
      )}
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'relative flex h-8 w-8 items-center justify-center rounded-full border-2',
          isCompleted && 'border-primary bg-primary text-primary-foreground',
          isCurrent && 'border-primary',
          !isCompleted && !isCurrent && 'border-muted text-muted-foreground'
        )}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
        <div className="absolute -bottom-6 whitespace-nowrap text-sm">
          {step.title}
        </div>
      </button>
    </div>
  );
}

export function Wizard({
  steps,
  onComplete,
  onCancel,
  initialStep = 0,
  className
}: WizardProps) {
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
    new Set()
  );

  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleStepClick = (index: number) => {
    if (index < currentStep || completedSteps.has(index)) {
      setCurrentStep(index);
    }
  };

  return (
    <div className={className}>
      {/* Steps indicator */}
      <div className="mb-8 flex items-center justify-center">
        {steps.map((step, index) => (
          <StepIndicator
            key={step.id}
            step={step}
            index={index}
            currentStep={currentStep}
            onClick={() => handleStepClick(index)}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="mt-8">
        {currentStepData.component}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <div>
          {onCancel && currentStep === 0 && (
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
            >
              Back
            </Button>
          )}
        </div>
        <Button onClick={handleNext}>
          {isLastStep ? 'Complete' : 'Next'}
        </Button>
      </div>

      {/* Optional step indicator */}
      {currentStepData.isOptional && (
        <div className="mt-2 text-sm text-muted-foreground">
          This step is optional
        </div>
      )}
    </div>
  );
}