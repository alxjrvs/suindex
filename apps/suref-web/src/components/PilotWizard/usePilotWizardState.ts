import { useState, useCallback, useMemo } from 'react'
import type { WizardState } from './utils'
import { validateWizardStep } from './utils'

export interface UsePilotWizardStateReturn {
  state: WizardState
  currentStep: number
  completedSteps: Set<number>
  isStepComplete: (step: number) => boolean
  getNextIncompleteStep: () => number | null
  goToStep: (step: number) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  setSelectedClassId: (classId: string | null) => void
  setSelectedAbilityId: (abilityId: string | null) => void
  setSelectedEquipmentIds: (equipmentIds: string[]) => void
  setCallsign: (callsign: string) => void
  setBackground: (background: string) => void
  setMotto: (motto: string) => void
  setKeepsake: (keepsake: string) => void
  setAppearance: (appearance: string) => void
  reset: () => void
}

const initialState: WizardState = {
  selectedClassId: null,
  selectedAbilityId: null,
  selectedEquipmentIds: [],
  callsign: '',
  background: '',
  motto: '',
  keepsake: '',
  appearance: '',
}

export function usePilotWizardState(): UsePilotWizardStateReturn {
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
    const nextIncomplete = getNextIncompleteStep()
    if (nextIncomplete !== null) {
      setCurrentStep(nextIncomplete)
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, getNextIncompleteStep])

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
    setSelectedClassId: useCallback((classId: string | null) => {
      setState((prev) => ({ ...prev, selectedClassId: classId }))
    }, []),
    setSelectedAbilityId: useCallback((abilityId: string | null) => {
      setState((prev) => ({ ...prev, selectedAbilityId: abilityId }))
    }, []),
    setSelectedEquipmentIds: useCallback((equipmentIds: string[]) => {
      setState((prev) => ({ ...prev, selectedEquipmentIds: equipmentIds }))
    }, []),
    setCallsign: useCallback((callsign: string) => {
      setState((prev) => ({ ...prev, callsign }))
    }, []),
    setBackground: useCallback((background: string) => {
      setState((prev) => ({ ...prev, background }))
    }, []),
    setMotto: useCallback((motto: string) => {
      setState((prev) => ({ ...prev, motto }))
    }, []),
    setKeepsake: useCallback((keepsake: string) => {
      setState((prev) => ({ ...prev, keepsake }))
    }, []),
    setAppearance: useCallback((appearance: string) => {
      setState((prev) => ({ ...prev, appearance }))
    }, []),
    reset,
  }
}
