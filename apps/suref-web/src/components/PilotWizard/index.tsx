import { BaseWizard } from '@/components/shared/BaseWizard'
import { usePilotWizardState } from './usePilotWizardState'
import { ClassSelectionStep } from './ClassSelectionStep'
import { EquipmentSelectionStep } from './EquipmentSelectionStep'
import { PersonalizeStep } from './PersonalizeStep'
import { useCreatePilotFromWizard } from './useCreatePilotFromWizard'
import { useState } from 'react'

export function PilotWizard() {
  const wizardState = usePilotWizardState()
  const createPilot = useCreatePilotFromWizard()
  const [isCreating, setIsCreating] = useState(false)

  const handleStepComplete = () => {
    wizardState.goToNextStep()
  }

  const handleCreatePilot = async () => {
    setIsCreating(true)
    try {
      await createPilot(wizardState.state)
    } catch (error) {
      console.error('Failed to create pilot:', error)
      setIsCreating(false)
    }
  }

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <ClassSelectionStep wizardState={wizardState} onComplete={handleStepComplete} />
      case 2:
        return <EquipmentSelectionStep wizardState={wizardState} onComplete={handleStepComplete} />
      case 3:
        return <PersonalizeStep wizardState={wizardState} onCreatePilot={handleCreatePilot} />
      default:
        return null
    }
  }

  const stepLabels = ['CLASS', 'EQUIPMENT', 'PERSONALIZE'] as const

  return (
    <BaseWizard
      stepLabels={stepLabels}
      currentStep={wizardState.currentStep}
      completedSteps={wizardState.completedSteps}
      onStepChange={wizardState.goToStep}
      onPrevious={wizardState.goToPreviousStep}
      renderStep={renderStep}
      isCreating={isCreating}
      creatingMessage="Creating your pilot..."
    />
  )
}
