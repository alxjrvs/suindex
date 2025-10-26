import { screen, within, waitFor } from '@testing-library/react'
import { expect } from 'vitest'
import type { UserEvent } from '@testing-library/user-event'

/**
 * Find a section by its heading text
 * @param sectionName - The name of the section (e.g., "abilities", "inventory")
 * @returns The section container element
 */
export function getSection(sectionName: string) {
  const heading = screen.getByText(new RegExp(`^${sectionName}$`, 'i'))
  const section = heading.closest('div')

  if (!section) {
    throw new Error(`Section "${sectionName}" not found`)
  }

  return section
}

/**
 * Get the add button (+) for a section
 * @param sectionName - The name of the section (e.g., "abilities", "inventory")
 * @returns The add button element
 */
export function getSectionAddButton(sectionName: string) {
  const section = getSection(sectionName)
  return within(section).getByRole('button', { name: '+' })
}

/**
 * Open a section's modal by clicking the add button
 * @param user - UserEvent instance from userEvent.setup()
 * @param sectionName - The name of the section (e.g., "abilities", "inventory")
 */
export async function openSection(user: UserEvent, sectionName: string) {
  const addButton = getSectionAddButton(sectionName)
  await user.click(addButton)
}

/**
 * Wait for a modal to appear with specific text
 * @param modalText - Text to look for in the modal
 */
export async function waitForModalOpen(modalText: string | RegExp) {
  await waitFor(() => {
    expect(screen.getByText(modalText)).toBeInTheDocument()
  })
}

/**
 * Wait for a modal to disappear
 * @param modalText - Text that should no longer be in the document
 */
export async function waitForModalClosed(modalText: string | RegExp) {
  await waitFor(() => {
    expect(screen.queryByText(modalText)).not.toBeInTheDocument()
  })
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
 * Close a modal and wait for it to disappear
 * @param user - UserEvent instance from userEvent.setup()
 * @param modalText - Text that should disappear from the modal
 */
export async function closeModalAndWait(user: UserEvent, modalText: string | RegExp) {
  await closeModal(user)
  await waitForModalClosed(modalText)
}

/**
 * Get the count display from a section (e.g., "0/6" from inventory)
 * @param sectionName - The name of the section
 * @returns The count text (e.g., "0/6")
 */
export function getSectionCount(sectionName: string): string {
  const section = getSection(sectionName)
  const countText = within(section).getByText(/\d+\/\d+/)
  return countText.textContent || ''
}

/**
 * Wait for a section's count to equal a specific value
 * @param sectionName - The name of the section
 * @param expectedCount - The expected count (e.g., "1/6")
 */
export async function waitForSectionCount(sectionName: string, expectedCount: string) {
  const section = getSection(sectionName)
  await waitFor(() => {
    expect(within(section).getByText(expectedCount)).toBeInTheDocument()
  })
}

/**
 * Find a button in a modal by its text
 * @param buttonText - The text or regex to match the button
 * @returns The button element
 */
export function getModalButton(buttonText: string | RegExp) {
  return screen.getByRole('button', { name: buttonText })
}

/**
 * Click a button in a modal by its text
 * @param user - UserEvent instance from userEvent.setup()
 * @param buttonText - The text or regex to match the button
 */
export async function clickModalButton(user: UserEvent, buttonText: string | RegExp) {
  const button = getModalButton(buttonText)
  await user.click(button)
}
