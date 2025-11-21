import { useCallback } from 'react'
import type { WizardState, BayNPCData, CrawlerNPCData } from './utils'
import { validateWizardStep } from './utils'
import { useBaseWizardState } from '@/hooks/useBaseWizardState'

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
  setBayNPCChoice: (bayId: string, choiceId: string, value: string) => void
  setCrawlerNPC: (npc: CrawlerNPCData | null) => void
  setCrawlerNPCChoice: (choiceId: string, value: string | undefined) => void
  setArmamentBayWeaponId: (weaponId: string | null) => void
  setName: (name: string) => void
  reset: () => void
}

const initialState: WizardState = {
  selectedCrawlerTypeId: null,
  bayNPCs: {},
  bayNPCChoices: {},
  crawlerNPC: null,
  crawlerNPCChoices: {},
  armamentBayWeaponId: null,
  name: '',
}

export function useCrawlerWizardState(): UseCrawlerWizardStateReturn {
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
    setSelectedCrawlerTypeId: useCallback(
      (crawlerTypeId: string | null) => {
        setState((prev) => {
          // Only clear bayNPCs and crawlerNPC when selecting a new crawler type
          // AND there was a previous selection (to avoid clearing on initial selection)
          const newCrawlerTypeId = crawlerTypeId
          const isNewType = prev.selectedCrawlerTypeId !== newCrawlerTypeId
          const hadPreviousSelection = prev.selectedCrawlerTypeId !== null
          const shouldClear = isNewType && hadPreviousSelection
          return {
            ...prev,
            selectedCrawlerTypeId: newCrawlerTypeId,
            bayNPCs: shouldClear ? {} : prev.bayNPCs,
            bayNPCChoices: shouldClear ? {} : prev.bayNPCChoices,
            crawlerNPC: shouldClear ? null : prev.crawlerNPC,
            crawlerNPCChoices: shouldClear ? {} : prev.crawlerNPCChoices,
            // Only clear armamentBayWeaponId if there was a previous crawler type
            armamentBayWeaponId: shouldClear ? null : prev.armamentBayWeaponId,
          }
        })
      },
      [setState]
    ),
    setCrawlerNPC: useCallback(
      (npc: CrawlerNPCData | null) => {
        setState((prev) => ({
          ...prev,
          crawlerNPC: npc,
        }))
      },
      [setState]
    ),
    setCrawlerNPCChoice: useCallback(
      (choiceId: string, value: string | undefined) => {
        setState((prev) => {
          if (value === undefined) {
            // Remove the choice when value is undefined (deselection)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [choiceId]: _choiceValue, ...rest } = prev.crawlerNPCChoices
            return {
              ...prev,
              crawlerNPCChoices: rest,
            }
          }
          return {
            ...prev,
            crawlerNPCChoices: {
              ...prev.crawlerNPCChoices,
              [choiceId]: value,
            },
          }
        })
      },
      [setState]
    ),
    setBayNPC: useCallback(
      (bayId: string, npc: BayNPCData) => {
        setState((prev) => ({
          ...prev,
          bayNPCs: {
            ...prev.bayNPCs,
            [bayId]: npc,
          },
        }))
      },
      [setState]
    ),
    setBayNPCChoice: useCallback(
      (bayId: string, choiceId: string, value: string) => {
        setState((prev) => ({
          ...prev,
          bayNPCChoices: {
            ...prev.bayNPCChoices,
            [bayId]: {
              ...prev.bayNPCChoices[bayId],
              [choiceId]: value,
            },
          },
        }))
      },
      [setState]
    ),
    setArmamentBayWeaponId: useCallback(
      (weaponId: string | null) => {
        setState((prev) => ({ ...prev, armamentBayWeaponId: weaponId }))
      },
      [setState]
    ),
    setName: useCallback(
      (name: string) => {
        setState((prev) => ({ ...prev, name }))
      },
      [setState]
    ),
    reset: baseWizard.reset,
  }
}
