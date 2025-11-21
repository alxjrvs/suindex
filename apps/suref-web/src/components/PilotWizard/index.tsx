import { Box, VStack, Button, Flex } from '@chakra-ui/react'
import { Text } from '@/components/base/Text'
import { WizardBreadcrumbs } from '@/components/shared/WizardBreadcrumbs'
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

  const renderStep = () => {
    switch (wizardState.currentStep) {
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
    <VStack gap={6} align="stretch" w="full" maxW="1200px" mx="auto" p={6}>
      {/* Breadcrumb Navigation */}
      <Flex justifyContent="space-between" alignItems="center" w="full">
        <Button
          variant="ghost"
          onClick={wizardState.goToPreviousStep}
          disabled={wizardState.currentStep === 1}
          _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
        >
          ← BACK
        </Button>
        <WizardBreadcrumbs
          labels={stepLabels}
          currentStep={wizardState.currentStep}
          completedSteps={wizardState.completedSteps}
          onStepClick={wizardState.goToStep}
        />
        <Box w="80px" /> {/* Spacer for alignment */}
      </Flex>

      {/* Step Content */}
      <Box w="full" opacity={isCreating ? 0.5 : 1} pointerEvents={isCreating ? 'none' : 'auto'}>
        {renderStep()}
      </Box>
      {isCreating && (
        <Box textAlign="center" py={4}>
          <Text fontSize="lg" fontWeight="bold">
            Creating your pilot...
          </Text>
        </Box>
      )}
    </VStack>
  )
}
