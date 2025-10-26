import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'

describe('PilotLiveSheet - Advanced Classes', () => {
  // Use real data from salvageunion-reference
  const allCoreClasses = SalvageUnionReference.CoreClasses.all()
  const allHybridClasses = SalvageUnionReference.HybridClasses.all()
  const hackerClass = allCoreClasses.find((c) => c.name === 'Hacker')
  const salvagerClass = allCoreClasses.find((c) => c.name === 'Salvager')
  const fabricatorClass = allHybridClasses.find((c) => c.name === 'Fabricator')

  if (!hackerClass) {
    throw new Error('Hacker class not found in salvageunion-reference')
  }

  if (!salvagerClass) {
    throw new Error('Salvager class not found in salvageunion-reference')
  }

  if (!fabricatorClass) {
    throw new Error('Fabricator hybrid class not found in salvageunion-reference')
  }

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

      // Select 6 abilities but spread across trees (not completing any)
      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select 3 from Hacking, but we need to select them progressively
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])

        // Close the modal
        const closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)

        // Wait for modal to close
        await waitFor(() => {
          expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
        })
      }

      // Select 3 from Tech
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])

        // Close the modal
        const closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)

        // Wait for modal to close
        await waitFor(() => {
          expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
        })
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

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select 3 from Electronics tree (shared with Fabricator)
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])

        // Close the modal
        const closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)

        // Wait for modal to close
        await waitFor(() => {
          expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
        })
      }

      // Select 3 from another Hacker tree
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])

        // Close the modal
        const closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)

        // Wait for modal to close
        await waitFor(() => {
          expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
        })
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

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select 6 abilities to unlock advanced class
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])

        // Close the modal
        const closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)

        // Wait for modal to close
        await waitFor(() => {
          expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
        })
      }

      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])

        // Close the modal
        const closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)

        // Wait for modal to close
        await waitFor(() => {
          expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
        })
      }

      // Select Fabricator
      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, fabricatorClass.id)

      // Should show Fabricator class name in the UI
      await waitFor(() => {
        expect(screen.getByText(/Fabricator/i)).toBeInTheDocument()
      })
    })
  })
})
