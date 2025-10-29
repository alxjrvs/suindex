import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import {
  findCoreClass,
  findAdvancedClass,
  getAbilities,
  expandAllAbilities,
} from '../../../test/helpers'

describe('PilotLiveSheet - Legendary Abilities', () => {
  // Get real data from salvageunion-reference
  const hackerClass = findCoreClass('Hacker')
  const hackerAdvancedClass = findAdvancedClass('Advanced Hacker')
  const allAbilities = getAbilities()

  // Get legendary abilities for Hacker advanced class by tree
  const legendaryAbilities = allAbilities.filter(
    (a) => a.tree === hackerAdvancedClass.legendaryTree
  )

  if (legendaryAbilities.length === 0) {
    throw new Error('No legendary abilities found for Advanced Hacker class')
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

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select 6 core abilities - abilities are now shown inline
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

      // Wait for advanced class to be enabled
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      // Select advanced class
      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, hackerAdvancedClass.id)

      // Expand all abilities again to see the advanced abilities
      await expandAllAbilities(user)

      // Select only 2 advanced abilities (not all 3) - abilities are now shown inline
      const addToCharacterButtons1 = await screen.findAllByRole('button', {
        name: /Add to Pilot \(2 TP\)/i,
      })
      await user.click(addToCharacterButtons1[0])

      const addToCharacterButtons2 = await screen.findAllByRole('button', {
        name: /Add to Pilot \(2 TP\)/i,
      })
      await user.click(addToCharacterButtons2[0])

      // Legendary ability should be visible in the inline display
      expect(screen.getByText(testLegendaryAbility.name)).toBeInTheDocument()

      // The "Add to Pilot (3 TP)" buttons should be present but disabled (not all advanced abilities selected)
      const legendaryButtons = screen.queryAllByRole('button', { name: /Add to Pilot \(3 TP\)/i })
      expect(legendaryButtons.length).toBeGreaterThan(0)
      legendaryButtons.forEach((button) => {
        expect(button).toBeDisabled()
      })
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

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select 6 core abilities - abilities are now shown inline
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

      // Wait for advanced class to be enabled
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      // Select advanced class
      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, hackerAdvancedClass.id)

      // Expand all abilities again to see the advanced abilities
      await expandAllAbilities(user)

      // Select all 3 advanced abilities - abilities are now shown inline
      for (let i = 0; i < 3; i++) {
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(2 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])
      }

      // Legendary should now be visible in the inline display
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

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select all required abilities - abilities are now shown inline
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

      // Wait for advanced class to be enabled
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, hackerAdvancedClass.id)

      // Expand all abilities again to see the advanced abilities
      await expandAllAbilities(user)

      for (let i = 0; i < 3; i++) {
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(2 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])
      }

      // Check current TP (30 - 6 core - 6 advanced = 18)
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('18')
        expect(tpValue).toBeInTheDocument()
      })

      // Expand all abilities again to see the legendary abilities
      await expandAllAbilities(user)

      // Select legendary ability - abilities are now shown inline
      await waitFor(() => screen.getByText(testLegendaryAbility.name))

      // Find and click the "Add to Pilot (3 TP)" button
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(3 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

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

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select all required abilities - abilities are now shown inline
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

      // Wait for advanced class to be enabled
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, hackerAdvancedClass.id)

      // Expand all abilities again to see the advanced abilities
      await expandAllAbilities(user)

      for (let i = 0; i < 3; i++) {
        const addToCharacterButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(2 TP\)/i,
        })
        await user.click(addToCharacterButtons[0])
      }

      // Expand all abilities again to see the legendary abilities
      await expandAllAbilities(user)

      // Select legendary ability - abilities are now shown inline
      await waitFor(() => screen.getByText(testLegendaryAbility.name))
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(3 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

      // Legendary ability should now be displayed in the abilities list
      await waitFor(() => {
        expect(screen.getByText(testLegendaryAbility.name)).toBeInTheDocument()
      })

      // After selecting one legendary ability, the "Add to Pilot (3 TP)" button should NOT be present for other legendary abilities
      // (only one legendary ability can be selected)
      expect(screen.queryAllByRole('button', { name: /Add to Pilot \(3 TP\)/i })).toHaveLength(0)
    })
  })
})
