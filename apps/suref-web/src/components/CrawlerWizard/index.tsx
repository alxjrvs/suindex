import { Box, VStack, Button, Flex } from '@chakra-ui/react'
import { Text } from '@/components/base/Text'
import { WizardBreadcrumbs } from '@/components/shared/WizardBreadcrumbs'
import { useCrawlerWizardState } from './useCrawlerWizardState'
import { CrawlerTypeSelectionStep } from './CrawlerTypeSelectionStep'
import { CrawlerBaysStep } from './CrawlerBaysStep'
import { CrawlerNameStep } from './CrawlerNameStep'
import { useCreateCrawlerFromWizard } from './useCreateCrawlerFromWizard'
import { useState } from 'react'

export function CrawlerWizard() {
  const wizardState = useCrawlerWizardState()
  const createCrawler = useCreateCrawlerFromWizard()
  const [isCreating, setIsCreating] = useState(false)

  const handleStepComplete = () => {
    wizardState.goToNextStep()
  }

  const handleCreateCrawler = async () => {
    setIsCreating(true)
    try {
      await createCrawler(wizardState.state)
    } catch (error) {
      console.error('Failed to create crawler:', error)
      setIsCreating(false)
    }
  }

  const renderStep = () => {
    switch (wizardState.currentStep) {
      case 1:
        return (
          <CrawlerTypeSelectionStep wizardState={wizardState} onComplete={handleStepComplete} />
        )
      case 2:
        return <CrawlerBaysStep wizardState={wizardState} onComplete={handleStepComplete} />
      case 3:
        return <CrawlerNameStep wizardState={wizardState} onCreateCrawler={handleCreateCrawler} />
      default:
        return null
    }
  }

  const stepLabels = ['CRAWLER TYPE', 'CRAWLER BAYS', 'NAME'] as const

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
            Creating your crawler...
          </Text>
        </Box>
      )}
    </VStack>
  )
}
