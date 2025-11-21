import { useCallback } from 'react'
import type { WizardState } from './utils'
import { validateWizardStep } from './utils'
import { useBaseWizardState } from '@/hooks/useBaseWizardState'

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
  const baseWizard = useBaseWizardState({
    initialState,
    validateStep: validateWizardStep,
    totalSteps: 3,
  })

  const { state, setState } = baseWizard

  return {
    state,
    currentStep: baseWizard.currentStep,
    completedSteps: baseWizard.completedSteps,
    isStepComplete: baseWizard.isStepComplete,
    getNextIncompleteStep: baseWizard.getNextIncompleteStep,
    goToStep: baseWizard.goToStep,
    goToNextStep: baseWizard.goToNextStep,
    goToPreviousStep: baseWizard.goToPreviousStep,
    setSelectedChassisId: useCallback(
      (chassisId: string | null) => {
        setState((prev) => ({ ...prev, selectedChassisId: chassisId }))
      },
      [setState]
    ),
    setSelectedSystemIds: useCallback(
      (systemIds: string[]) => {
        setState((prev) => ({ ...prev, selectedSystemIds: systemIds }))
      },
      [setState]
    ),
    setSelectedModuleIds: useCallback(
      (moduleIds: string[]) => {
        setState((prev) => ({ ...prev, selectedModuleIds: moduleIds }))
      },
      [setState]
    ),
    setSelectedPatternName: useCallback(
      (patternName: string | null) => {
        setState((prev) => ({ ...prev, selectedPatternName: patternName }))
      },
      [setState]
    ),
    setAppearance: useCallback(
      (appearance: string) => {
        setState((prev) => ({ ...prev, appearance }))
      },
      [setState]
    ),
    setQuirk: useCallback(
      (quirk: string) => {
        setState((prev) => ({ ...prev, quirk }))
      },
      [setState]
    ),
    setPatternName: useCallback(
      (patternName: string) => {
        setState((prev) => ({ ...prev, patternName }))
      },
      [setState]
    ),
    reset: baseWizard.reset,
  }
}
