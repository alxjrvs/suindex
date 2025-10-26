import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

/**
 * Get a combobox by its label or index
 * @param labelOrIndex - The label of the combobox or its index (0-based)
 * @returns The combobox element
 */
export function getCombobox(labelOrIndex: string | number) {
  if (typeof labelOrIndex === 'number') {
    const comboboxes = screen.getAllByRole('combobox')
    return comboboxes[labelOrIndex]
  }

  return screen.getByRole('combobox', { name: new RegExp(labelOrIndex, 'i') })
}

/**
 * Select an option from a combobox
 * @param user - UserEvent instance from userEvent.setup()
 * @param labelOrIndex - The label of the combobox or its index (0-based)
 * @param optionValue - The value of the option to select
 */
export async function selectComboboxOption(
  user: UserEvent,
  labelOrIndex: string | number,
  optionValue: string
) {
  const combobox = getCombobox(labelOrIndex)
  await user.selectOptions(combobox, optionValue)
}

/**
 * Get all options from a combobox
 * @param labelOrIndex - The label of the combobox or its index (0-based)
 * @returns Array of option elements
 */
export function getComboboxOptions(labelOrIndex: string | number) {
  const combobox = getCombobox(labelOrIndex)
  return combobox.querySelectorAll('option')
}

/**
 * Get the number of options in a combobox
 * @param labelOrIndex - The label of the combobox or its index (0-based)
 * @returns The number of options
 */
export function getComboboxOptionCount(labelOrIndex: string | number): number {
  return getComboboxOptions(labelOrIndex).length
}

/**
 * Check if a combobox is disabled
 * @param labelOrIndex - The label of the combobox or its index (0-based)
 * @returns True if the combobox is disabled
 */
export function isComboboxDisabled(labelOrIndex: string | number): boolean {
  const combobox = getCombobox(labelOrIndex)
  return combobox.hasAttribute('disabled')
}
