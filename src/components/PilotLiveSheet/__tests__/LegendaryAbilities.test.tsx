import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'

describe('PilotLiveSheet - Legendary Abilities', () => {
  // Get real data from salvageunion-reference
  const allClasses = SalvageUnionReference.Classes.all()
  const allAbilities = SalvageUnionReference.Abilities.all()

  // Find Hacker class for testing
  const hackerClass = allClasses.find((c) => c.name === 'Hacker')

  if (!hackerClass) {
    throw new Error('Hacker class not found in salvageunion-reference')
  }

  // Get legendary abilities for Hacker class
  const legendaryAbilityNames = new Set(hackerClass.legendaryAbilities || [])
  const legendaryAbilities = allAbilities.filter((a) => legendaryAbilityNames.has(a.name))

  if (legendaryAbilities.length === 0) {
    throw new Error('No legendary abilities found for Hacker class')
  }

  // Use the first legendary ability for testing
  const testLegendaryAbility = legendaryAbilities[0]

  beforeEach(() => {
    // Mock window.confirm to always return true
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  describe('Legendary Ability Requirements', () => {
    it('does not show legendary abilities until all advanced abilities are selected', async () => {
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

      // Select 6 core abilities
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

      // Wait for advanced class to be enabled
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      // Select advanced class
      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, hackerClass.id)

      // Select only 2 advanced abilities (not all 3)
      await user.click(addButton)

      const addToCharacterButtons1 = await screen.findAllByRole('button', {
        name: /Add to Pilot \(2 TP\)/i,
      })
      await user.click(addToCharacterButtons1[0])

      // Close the modal
      let closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      await user.click(addButton)

      const addToCharacterButtons2 = await screen.findAllByRole('button', {
        name: /Add to Pilot \(2 TP\)/i,
      })
      await user.click(addToCharacterButtons2[0])

      // Close the modal
      closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Open modal - legendary should be visible but NOT selectable yet
      await user.click(addButton)

      // Wait for modal to open
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
      })

      // Legendary ability should be visible
      expect(screen.getByText(testLegendaryAbility.name)).toBeInTheDocument()

      // But the "Add to Pilot (3 TP)" button should NOT be present (hidden when not selectable)
      expect(
        screen.queryByRole('button', { name: /Add to Pilot \(3 TP\)/i })
      ).not.toBeInTheDocument()
    })

    it('shows legendary abilities after all advanced abilities are selected', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 30 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 30; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select 6 core abilities
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

      // Wait for advanced class to be enabled
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      // Select advanced class
      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, hackerClass.id)

      // Select all 3 advanced abilities
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(2 TP\)/i,
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

      // Open modal - legendary should now be visible
      await user.click(addButton)
      await waitFor(() => {
        expect(screen.getByText(testLegendaryAbility.name)).toBeInTheDocument()
      })
    })

    it('requires 3 TP to select legendary ability', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 30 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 30; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select all required abilities
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

      // Wait for advanced class to be enabled
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, hackerClass.id)

      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(2 TP\)/i,
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

      // Check current TP (30 - 6 core - 6 advanced = 18)
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('18')
        expect(tpValue).toBeInTheDocument()
      })

      // Select legendary ability
      await user.click(addButton)
      await waitFor(() => screen.getByText(testLegendaryAbility.name))

      // Find and click the "Add to Pilot (3 TP)" button
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(3 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // TP should be reduced by 3 (18 - 3 = 15)
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('15')
        expect(tpValue).toBeInTheDocument()
      })
    })

    it('only allows one legendary ability to be selected', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 30 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 30; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select all required abilities
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

      // Wait for advanced class to be enabled
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, hackerClass.id)

      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(2 TP\)/i,
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

      // Select legendary ability
      await user.click(addButton)
      await waitFor(() => screen.getByText(testLegendaryAbility.name))
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(3 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Legendary ability should now be displayed in the abilities list
      await waitFor(() => {
        expect(screen.getByText(testLegendaryAbility.name)).toBeInTheDocument()
      })

      // Open modal again - legendary section should be visible but button should not be present (already selected one)
      await user.click(addButton)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
      })

      // Legendary section should be visible
      expect(screen.getByText(/legendary abilities/i)).toBeInTheDocument()

      // But the "Add to Pilot (3 TP)" button should NOT be present (already selected one)
      expect(
        screen.queryByRole('button', { name: /Add to Pilot \(3 TP\)/i })
      ).not.toBeInTheDocument()
    })
  })
})
