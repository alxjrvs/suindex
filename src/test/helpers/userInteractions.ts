import { screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'
import type { UserEvent } from '@testing-library/user-event'
import { incrementStepper, getStepperValue } from './steppers'
import { openSection } from './sections'

/**
 * Common user interaction helpers for tests
 * These eliminate duplicate interaction patterns across test files
 */

/**
 * Increment TP (Talent Points) by clicking the increment button N times
 * @param user - UserEvent instance from userEvent.setup()
 * @param times - Number of times to increment (default: 1)
 */
export async function incrementTP(user: UserEvent, times: number = 1) {
  await incrementStepper(user, 'TP', times)
}

/**
 * Select a class from the class dropdown
 * @param user - UserEvent instance from userEvent.setup()
 * @param classId - The ID of the class to select
 */
export async function selectClass(user: UserEvent, classId: string) {
  const classSelect = screen.getAllByRole('combobox')[0]
  await user.selectOptions(classSelect, classId)
}

/**
 * Open a modal by finding and clicking the add button in a section
 * @param user - UserEvent instance from userEvent.setup()
 * @param sectionName - The name of the section (e.g., "abilities", "inventory")
 */
export async function openSectionModal(user: UserEvent, sectionName: string) {
  await openSection(user, sectionName)
}

/**
 * Close a modal by clicking the close button
 * @param user - UserEvent instance from userEvent.setup()
 */
export async function closeModal(user: UserEvent) {
  const closeButton = screen.getByRole('button', { name: /close/i })
  await user.click(closeButton)
}

/**
 * Wait for a modal to appear with specific text
 * @param modalText - Text to look for in the modal
 */
export async function waitForModal(modalText: string | RegExp) {
  await waitFor(() => {
    expect(screen.getByText(modalText)).toBeInTheDocument()
  })
}

/**
 * Wait for a modal to disappear
 * @param modalText - Text that should no longer be in the document
 */
export async function waitForModalToClose(modalText: string | RegExp) {
  await waitFor(() => {
    expect(screen.queryByText(modalText)).not.toBeInTheDocument()
  })
}

/**
 * Get the current TP value from the TP stepper
 * @returns The current TP value as a number
 */
export function getCurrentTPValue(): number {
  return getStepperValue('TP')
}

/**
 * Wait for TP value to equal a specific number
 * @param expectedValue - The expected TP value
 */
export async function waitForTPValue(expectedValue: number) {
  await waitFor(() => {
    expect(getStepperValue('TP')).toBe(expectedValue)
  })
}

/**
 * Add an ability by opening the modal and clicking the add button
 * @param user - UserEvent instance from userEvent.setup()
 * @param abilityName - The name of the ability to add
 */
export async function addAbility(user: UserEvent, abilityName: string) {
  await openSectionModal(user, 'abilities')
  const addButton = screen.getByRole('button', {
    name: new RegExp(`Add to Pilot.*${abilityName}`, 'i'),
  })
  await user.click(addButton)
}

/**
 * Add equipment by opening the modal and clicking the add button
 * @param user - UserEvent instance from userEvent.setup()
 * @param equipmentName - The name of the equipment to add
 */
export async function addEquipment(user: UserEvent, equipmentName: string) {
  await openSectionModal(user, 'inventory')
  const addButton = screen.getByRole('button', { name: new RegExp(`Equip ${equipmentName}`, 'i') })
  await user.click(addButton)
}

/**
 * Expand all collapsed abilities in the abilities section
 * Abilities are displayed inline and collapsed by default.
 * This helper expands all of them so their "Add to Pilot" buttons become visible.
 *
 * @param user - UserEvent instance from userEvent.setup()
 */
export async function expandAllAbilities(user: UserEvent) {
  // Find all ability headers that are collapsed (have ▶ symbol)
  const allHeaders = screen.queryAllByTestId('frame-header-container')

  for (const header of allHeaders) {
    const hasExpandArrow = header.textContent?.includes('▶')
    if (hasExpandArrow) {
      await user.click(header)
      // Small delay to allow expansion
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

/**
 * Select the first available ability with a specific TP cost
 * Abilities are displayed inline and collapsed by default, so this helper:
 * 1. Expands all abilities to make "Add to Pilot" buttons visible
 * 2. Finds and clicks the first "Add to Pilot (X TP)" button
 *
 * @param user - UserEvent instance from userEvent.setup()
 * @param tpCost - The TP cost of the ability (e.g., 1, 2, or 3)
 */
export async function selectAbilityByTPCost(user: UserEvent, tpCost: number) {
  // Expand all abilities first
  await expandAllAbilities(user)

  // Now find and click the button
  const buttonPattern = new RegExp(`Add to Pilot \\(${tpCost} TP\\)`, 'i')
  const addButtons = await screen.findAllByRole('button', { name: buttonPattern })
  await user.click(addButtons[0])
}
