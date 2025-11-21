import { useCallback } from 'react'
import type { WizardState } from './utils'
import { validateWizardStep } from './utils'
import { useBaseWizardState } from '@/hooks/useBaseWizardState'

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
    setSelectedClassId: useCallback(
      (classId: string | null) => {
        setState((prev) => ({ ...prev, selectedClassId: classId }))
      },
      [setState]
    ),
    setSelectedAbilityId: useCallback(
      (abilityId: string | null) => {
        setState((prev) => ({ ...prev, selectedAbilityId: abilityId }))
      },
      [setState]
    ),
    setSelectedEquipmentIds: useCallback(
      (equipmentIds: string[]) => {
        setState((prev) => ({ ...prev, selectedEquipmentIds: equipmentIds }))
      },
      [setState]
    ),
    setCallsign: useCallback(
      (callsign: string) => {
        setState((prev) => ({ ...prev, callsign }))
      },
      [setState]
    ),
    setBackground: useCallback(
      (background: string) => {
        setState((prev) => ({ ...prev, background }))
      },
      [setState]
    ),
    setMotto: useCallback(
      (motto: string) => {
        setState((prev) => ({ ...prev, motto }))
      },
      [setState]
    ),
    setKeepsake: useCallback(
      (keepsake: string) => {
        setState((prev) => ({ ...prev, keepsake }))
      },
      [setState]
    ),
    setAppearance: useCallback(
      (appearance: string) => {
        setState((prev) => ({ ...prev, appearance }))
      },
      [setState]
    ),
    reset: baseWizard.reset,
  }
}
