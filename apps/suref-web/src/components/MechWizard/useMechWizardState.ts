import { useState, useCallback, useMemo } from 'react'
import type { WizardState } from './utils'
import { validateWizardStep } from './utils'

export interface UseMechWizardStateReturn {
  state: WizardState
  currentStep: number
  completedSteps: Set<number>
  isStepComplete: (step: number) => boolean
  getNextIncompleteStep: () => number | null
  goToStep: (step: number) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  setSelectedChassisId: (chassisId: string | null) => void
  setSelectedSystemIds: (systemIds: string[]) => void
  setSelectedModuleIds: (moduleIds: string[]) => void
  setSelectedPatternName: (patternName: string | null) => void
  setAppearance: (appearance: string) => void
  setQuirk: (quirk: string) => void
  setPatternName: (patternName: string) => void
  reset: () => void
}

const initialState: WizardState = {
  selectedChassisId: null,
  selectedSystemIds: [],
  selectedModuleIds: [],
  selectedPatternName: null,
  appearance: '',
  quirk: '',
  patternName: '',
}

export function useMechWizardState(): UseMechWizardStateReturn {
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
    setSelectedChassisId: useCallback((chassisId: string | null) => {
      setState((prev) => ({ ...prev, selectedChassisId: chassisId }))
    }, []),
    setSelectedSystemIds: useCallback((systemIds: string[]) => {
      setState((prev) => ({ ...prev, selectedSystemIds: systemIds }))
    }, []),
    setSelectedModuleIds: useCallback((moduleIds: string[]) => {
      setState((prev) => ({ ...prev, selectedModuleIds: moduleIds }))
    }, []),
    setSelectedPatternName: useCallback((patternName: string | null) => {
      setState((prev) => ({ ...prev, selectedPatternName: patternName }))
    }, []),
    setAppearance: useCallback((appearance: string) => {
      setState((prev) => ({ ...prev, appearance }))
    }, []),
    setQuirk: useCallback((quirk: string) => {
      setState((prev) => ({ ...prev, quirk }))
    }, []),
    setPatternName: useCallback((patternName: string) => {
      setState((prev) => ({ ...prev, patternName }))
    }, []),
    reset,
  }
}
