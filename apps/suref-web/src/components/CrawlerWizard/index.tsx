import { BaseWizard } from '@/components/shared/BaseWizard'
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

  const renderStep = (step: number) => {
    switch (step) {
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
    <BaseWizard
      stepLabels={stepLabels}
      currentStep={wizardState.currentStep}
      completedSteps={wizardState.completedSteps}
      onStepChange={wizardState.goToStep}
      onPrevious={wizardState.goToPreviousStep}
      renderStep={renderStep}
      isCreating={isCreating}
      creatingMessage="Creating your crawler..."
    />
  )
}
