import { useState, useCallback, useMemo } from 'react'
import type { WizardState, BayNPCData, CrawlerNPCData } from './utils'
import { validateWizardStep } from './utils'

export interface UseCrawlerWizardStateReturn {
  state: WizardState
  currentStep: number
  completedSteps: Set<number>
  isStepComplete: (step: number) => boolean
  getNextIncompleteStep: () => number | null
  goToStep: (step: number) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  setSelectedCrawlerTypeId: (crawlerTypeId: string | null) => void
  setBayNPC: (bayId: string, npc: BayNPCData) => void
  setCrawlerNPC: (npc: CrawlerNPCData | null) => void
  setCrawlerNPCChoice: (choiceId: string, value: string) => void
  setArmamentBayWeaponId: (weaponId: string | null) => void
  setName: (name: string) => void
  reset: () => void
}

const initialState: WizardState = {
  selectedCrawlerTypeId: null,
  bayNPCs: {},
  crawlerNPC: null,
  crawlerNPCChoices: {},
  armamentBayWeaponId: null,
  name: '',
}

export function useCrawlerWizardState(): UseCrawlerWizardStateReturn {
  const [state, setState] = useState<WizardState>(initialState)
  const [currentStep, setCurrentStep] = useState(1)

  const completedSteps = useMemo(() => {
    const completed = new Set<number>()
    for (let step = 1; step <= 3; step++) {
      if (validateWizardStep(step, state)) {
        completed.add(step)
      }
    }
    return completed
  }, [state])

  const isStepComplete = useCallback(
    (step: number): boolean => {
      return validateWizardStep(step, state)
    },
    [state]
  )

  const getNextIncompleteStep = useCallback((): number | null => {
    for (let step = 1; step <= 3; step++) {
      if (!validateWizardStep(step, state)) {
        return step
      }
    }
    return null
  }, [state])

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step)
    }
  }, [])

  const goToNextStep = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep])

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const reset = useCallback(() => {
    setState(initialState)
    setCurrentStep(1)
  }, [])

  return {
    state,
    currentStep,
    completedSteps,
    isStepComplete,
    getNextIncompleteStep,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    setSelectedCrawlerTypeId: useCallback((crawlerTypeId: string | null) => {
      setState((prev) => {
        // Clear bayNPCs and crawlerNPC when selecting a new crawler type
        const newCrawlerTypeId = crawlerTypeId
        const isNewType = prev.selectedCrawlerTypeId !== newCrawlerTypeId
        return {
          ...prev,
          selectedCrawlerTypeId: newCrawlerTypeId,
          bayNPCs: isNewType ? {} : prev.bayNPCs,
          crawlerNPC: isNewType ? null : prev.crawlerNPC,
          crawlerNPCChoices: isNewType ? {} : prev.crawlerNPCChoices,
        }
      })
    }, []),
    setCrawlerNPC: useCallback((npc: CrawlerNPCData | null) => {
      setState((prev) => ({
        ...prev,
        crawlerNPC: npc,
      }))
    }, []),
    setCrawlerNPCChoice: useCallback((choiceId: string, value: string) => {
      setState((prev) => ({
        ...prev,
        crawlerNPCChoices: {
          ...prev.crawlerNPCChoices,
          [choiceId]: value,
        },
      }))
    }, []),
    setBayNPC: useCallback((bayId: string, npc: BayNPCData) => {
      setState((prev) => ({
        ...prev,
        bayNPCs: {
          ...prev.bayNPCs,
          [bayId]: npc,
        },
      }))
    }, []),
    setArmamentBayWeaponId: useCallback((weaponId: string | null) => {
      setState((prev) => ({ ...prev, armamentBayWeaponId: weaponId }))
    }, []),
    setName: useCallback((name: string) => {
      setState((prev) => ({ ...prev, name }))
    }, []),
    reset,
  }
}
