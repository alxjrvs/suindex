import { screen, within, waitFor } from '@testing-library/react'
import { expect } from 'vitest'
import type { UserEvent } from '@testing-library/user-event'

/**
 * Get a stepper group by its label
 * @param label - The label of the stepper (e.g., 'TP', 'HP', 'SP')
 * @returns The stepper group element
 */
export function getStepperGroup(label: string) {
  return screen.getByRole('group', { name: new RegExp(label, 'i') })
}

/**
 * Get the increment button for a stepper
 * @param stepperLabel - The label of the stepper (e.g., 'TP', 'HP', 'SP')
 * @returns The increment button element
 */
export function getIncrementButton(stepperLabel: string) {
  const stepper = getStepperGroup(stepperLabel)
  return stepper.querySelector(
    `button[aria-label="Increment ${stepperLabel}"]`
  ) as HTMLButtonElement
}

/**
 * Get the decrement button for a stepper
 * @param stepperLabel - The label of the stepper (e.g., 'TP', 'HP', 'SP')
 * @returns The decrement button element
 */
export function getDecrementButton(stepperLabel: string) {
  const stepper = getStepperGroup(stepperLabel)
  return stepper.querySelector(
    `button[aria-label="Decrement ${stepperLabel}"]`
  ) as HTMLButtonElement
}

/**
 * Click the increment button on a stepper N times
 * @param user - UserEvent instance from userEvent.setup()
 * @param stepperLabel - The label of the stepper (e.g., 'TP', 'HP', 'SP')
 * @param times - Number of times to increment (default: 1)
 */
export async function incrementStepper(user: UserEvent, stepperLabel: string, times: number = 1) {
  const button = getIncrementButton(stepperLabel)

  for (let i = 0; i < times; i++) {
    await user.click(button)
  }
}

/**
 * Click the decrement button on a stepper N times
 * @param user - UserEvent instance from userEvent.setup()
 * @param stepperLabel - The label of the stepper (e.g., 'TP', 'HP', 'SP')
 * @param times - Number of times to decrement (default: 1)
 */
export async function decrementStepper(user: UserEvent, stepperLabel: string, times: number = 1) {
  const button = getDecrementButton(stepperLabel)

  for (let i = 0; i < times; i++) {
    await user.click(button)
  }
}

/**
 * Get the current value from a stepper
 * @param stepperLabel - The label of the stepper (e.g., 'TP', 'HP', 'SP')
 * @returns The current value as a number
 */
export function getStepperValue(stepperLabel: string): number {
  const stepper = getStepperGroup(stepperLabel)
  const valueText = within(stepper).getByText(/\d+/)
  return parseInt(valueText.textContent || '0', 10)
}

/**
 * Get the full display value from a stepper (e.g., "5/10" or just "5")
 * @param stepperLabel - The label of the stepper (e.g., 'TP', 'HP', 'SP')
 * @returns The full display value as a string
 */
export function getStepperDisplayValue(stepperLabel: string): string {
  const stepper = getStepperGroup(stepperLabel)
  const valueText = within(stepper).getByText(/\d+/)
  return valueText.textContent || '0'
}

/**
 * Wait for a stepper to have a specific value
 * @param stepperLabel - The label of the stepper (e.g., 'TP', 'HP', 'SP')
 * @param expectedValue - The expected value
 */
export async function waitForStepperValue(stepperLabel: string, expectedValue: number) {
  const stepper = getStepperGroup(stepperLabel)
  await waitFor(() => {
    expect(within(stepper).getByText(expectedValue.toString())).toBeInTheDocument()
  })
}

/**
 * Wait for a stepper to have a specific display value (e.g., "5/10")
 * @param stepperLabel - The label of the stepper (e.g., 'TP', 'HP', 'SP')
 * @param expectedDisplayValue - The expected display value (e.g., "5/10")
 */
export async function waitForStepperDisplayValue(
  stepperLabel: string,
  expectedDisplayValue: string
) {
  const stepper = getStepperGroup(stepperLabel)
  await waitFor(() => {
    expect(within(stepper).getByText(expectedDisplayValue)).toBeInTheDocument()
  })
}

/**
 * Check if a stepper button is disabled
 * @param stepperLabel - The label of the stepper (e.g., 'TP', 'HP', 'SP')
 * @param buttonType - 'increment' or 'decrement'
 * @returns True if the button is disabled
 */
export function isStepperButtonDisabled(
  stepperLabel: string,
  buttonType: 'increment' | 'decrement'
): boolean {
  const button =
    buttonType === 'increment' ? getIncrementButton(stepperLabel) : getDecrementButton(stepperLabel)
  return button.disabled
}
