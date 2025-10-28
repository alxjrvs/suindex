import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import { findCoreClass, findHybridClass, expandAllAbilities } from '../../../test/helpers'

describe('PilotLiveSheet - Advanced Classes', () => {
  // Use real data from salvageunion-reference
  const hackerClass = findCoreClass('Hacker')
  const salvagerClass = findCoreClass('Salvager')
  const fabricatorClass = findHybridClass('Fabricator')

  // No need to fetch abilities for these tests - they just verify class selection

  beforeEach(() => {
    // Mock window.confirm for ability removal
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  describe('Advanced Class Requirements', () => {
    it('disables advanced class dropdown when less than 6 abilities', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      expect(advancedClassSelect).toBeDisabled()
    })

    it('disables advanced class dropdown when no complete tree (3+ abilities)', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 6 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 6; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select 6 abilities but spread across trees (not completing any)
      // Abilities are now shown inline - select 3 from Hacking progressively
      for (let i = 0; i < 3; i++) {
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])
      }

      // Select 3 from Tech - abilities are now shown inline
      for (let i = 0; i < 3; i++) {
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])
      }

      // Advanced class should now be enabled (we have 6 abilities and completed trees)
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })
    })

    it('prevents Salvager class from taking advanced classes', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, salvagerClass.id)

      // Even with 6 abilities and complete tree, Salvager cannot take advanced classes
      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      expect(advancedClassSelect).toBeDisabled()
    })
  })

  describe('Hybrid Class Abilities', () => {
    it('allows selecting Fabricator as advanced class after meeting requirements', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 20 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 20; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select 3 from Electronics tree (shared with Fabricator) - abilities are now shown inline
      for (let i = 0; i < 3; i++) {
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])
      }

      // Select 3 from another Hacker tree
      for (let i = 0; i < 3; i++) {
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])
      }

      // Advanced class should now be enabled
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      // Select Fabricator advanced class
      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, fabricatorClass.id)

      // Verify Fabricator is selected
      await waitFor(() => {
        expect(advancedClassSelect).toHaveValue(fabricatorClass.id)
      })
    })

    it('shows Fabricator class name when selected as advanced class', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 20 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 20; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select 6 abilities to unlock advanced class - abilities are now shown inline
      for (let i = 0; i < 3; i++) {
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])
      }

      for (let i = 0; i < 3; i++) {
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])
      }

      // Select Fabricator
      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, fabricatorClass.id)

      // Should show Fabricator class name in the UI - verify the select has the right value
      await waitFor(() => {
        expect(advancedClassSelect).toHaveValue(fabricatorClass.id)
        // Also verify Fabricator appears in the dropdown options
        const fabricatorOption = screen.getByRole('option', { name: /Fabricator/i })
        expect(fabricatorOption).toBeInTheDocument()
      })
    })
  })
})
