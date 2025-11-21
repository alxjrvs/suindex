import { BaseWizard } from '@/components/shared/BaseWizard'
import { useMechWizardState } from './useMechWizardState'
import { ChassisSelectionStep } from './ChassisSelectionStep'
import { SystemsModulesStep } from './SystemsModulesStep'
import { DetailsStep } from './DetailsStep'
import { useCreateMechFromWizard } from './useCreateMechFromWizard'
import { BudgetDisplay } from './BudgetDisplay'
import { useState } from 'react'

export function MechWizard() {
  const wizardState = useMechWizardState()
  const createMech = useCreateMechFromWizard()
  const [isCreating, setIsCreating] = useState(false)

  const handleStepComplete = () => {
    wizardState.goToNextStep()
  }

  const handleCreateMech = async () => {
    setIsCreating(true)
    try {
      await createMech(wizardState.state)
    } catch (error) {
      console.error('Failed to create mech:', error)
      setIsCreating(false)
    }
  }

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <ChassisSelectionStep wizardState={wizardState} onComplete={handleStepComplete} />
      case 2:
        return <SystemsModulesStep wizardState={wizardState} onComplete={handleStepComplete} />
      case 3:
        return <DetailsStep wizardState={wizardState} onCreateMech={handleCreateMech} />
      default:
        return null
    }
  }

  const stepLabels = ['CHASSIS', 'SYSTEMS & MODULES', 'DETAILS'] as const

  return (
    <BaseWizard
      stepLabels={stepLabels}
      currentStep={wizardState.currentStep}
      completedSteps={wizardState.completedSteps}
      onStepChange={wizardState.goToStep}
      onPrevious={wizardState.goToPreviousStep}
      renderStep={renderStep}
      isCreating={isCreating}
      creatingMessage="Creating your mech..."
      headerContent={<BudgetDisplay state={wizardState.state} />}
    />
  )
}

export default MechWizard
