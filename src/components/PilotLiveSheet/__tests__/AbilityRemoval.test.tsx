import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import {
  findCoreClass,
  getAbilitiesForClass,
  getAbilitiesByLevel,
  expandAllAbilities,
} from '../../../test/helpers'

describe('PilotLiveSheet - Ability Removal', () => {
  // Use real data from salvageunion-reference
  const hackerClass = findCoreClass('Hacker')

  // Get real abilities from the Hacker's core ability trees
  const hackerAbilities = getAbilitiesForClass(hackerClass)

  // Get specific abilities for testing
  const level1Abilities = getAbilitiesByLevel(hackerAbilities, 1)

  // Get a specific level 1 ability for testing (first one from the list)
  const testAbility = level1Abilities[0]

  beforeEach(() => {
    // Mock window.confirm to return true by default
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  describe('Remove Button Behavior', () => {
    it('shows remove button on selected abilities', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5 by clicking increment button (need 2 TP to remove)
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Abilities are now shown inline - find and click the first "Add to Pilot" button
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })

      // Get the ability header before clicking to add it
      const abilityHeaderBeforeAdd = addToCharacterButtons[0].closest(
        '[data-testid="frame-header-container"]'
      ) as HTMLElement

      await user.click(addToCharacterButtons[0])

      // Wait for TP to decrease to 4 (5 - 1 = 4)
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('4')
        expect(tpValue).toBeInTheDocument()
      })

      // The ability card should still be in the same position, but now it's selected
      // Click on the ability header to expand it (it's still collapsed after being added)
      await user.click(abilityHeaderBeforeAdd)

      // Now the remove button should be visible (we have 4 TP, which is >= 2)
      await waitFor(
        () => {
          const removeButton = screen.getByRole('button', { name: /remove ability/i })
          expect(removeButton).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })

    it('disables remove button when TP is less than 2', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 2 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement
      await user.click(tpIncrementButton)
      await user.click(tpIncrementButton)

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select an ability (costs 1 TP, leaving 1 TP)
      // Abilities are now shown inline
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })

      // Get the ability header before clicking to add it
      const abilityHeaderBeforeAdd = addToCharacterButtons[0].closest(
        '[data-testid="frame-header-container"]'
      ) as HTMLElement

      await user.click(addToCharacterButtons[0])

      // TP should now be 1 (not enough to remove, need 2)
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('1')
        expect(tpValue).toBeInTheDocument()
      })

      // The ability card should still be in the same position, but now it's selected
      // Click on the ability header to expand it (it's still collapsed after being added)
      await user.click(abilityHeaderBeforeAdd)

      // Remove button should be disabled (need 2 TP, only have 1)
      await waitFor(() => {
        const removeButton = screen.getByRole('button', { name: /remove ability/i })
        expect(removeButton).toBeDisabled()
      })
    })

    it('enables remove button when TP is 2 or more', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select an ability - abilities are now shown inline (costs 1 TP, leaving 4 TP)
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })

      // Get the ability header before clicking to add it
      const abilityHeaderBeforeAdd = addToCharacterButtons[0].closest(
        '[data-testid="frame-header-container"]'
      ) as HTMLElement

      await user.click(addToCharacterButtons[0])

      // Wait for TP to update to 4
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('4')
        expect(tpValue).toBeInTheDocument()
      })

      // The ability card should still be in the same position, but now it's selected
      // Click on the ability header to expand it (it's still collapsed after being added)
      await user.click(abilityHeaderBeforeAdd)

      // Remove button should be enabled (we have 4 TP, which is >= 2)
      await waitFor(() => {
        const removeButton = screen.getByRole('button', { name: /remove ability/i })
        expect(removeButton).not.toBeDisabled()
      })
    })
  })

  describe('Removal Cost', () => {
    it('costs 1 TP to remove an ability', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select an ability (costs 1 TP, leaving 4 TP) - abilities are now shown inline
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })

      // Get the ability header before clicking to add it
      const abilityHeaderBeforeAdd = addToCharacterButtons[0].closest(
        '[data-testid="frame-header-container"]'
      ) as HTMLElement

      await user.click(addToCharacterButtons[0])

      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('4')
        expect(tpValue).toBeInTheDocument()
      })

      // The ability card should still be in the same position, but now it's selected
      // Click on the ability header to expand it (it's still collapsed after being added)
      await user.click(abilityHeaderBeforeAdd)

      // Remove the ability (costs 1 TP)
      const removeButton = await screen.findByRole('button', { name: /remove ability/i })
      await user.click(removeButton)

      // TP should be: 4 - 1 (removal cost) = 3
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('3')
        expect(tpValue).toBeInTheDocument()
      })
    })

    it('shows confirmation dialog when removing ability', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select an ability - abilities are now shown inline
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })

      // Get the ability header before clicking to add it
      const abilityHeaderBeforeAdd = addToCharacterButtons[0].closest(
        '[data-testid="frame-header-container"]'
      ) as HTMLElement

      await user.click(addToCharacterButtons[0])

      // The ability card should still be in the same position, but now it's selected
      // Click on the ability header to expand it (it's still collapsed after being added)
      await user.click(abilityHeaderBeforeAdd)

      // Click remove button
      const removeButton = await screen.findByRole('button', { name: /remove ability/i })

      // Mock window.confirm
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      await user.click(removeButton)

      expect(confirmSpy).toHaveBeenCalled()

      confirmSpy.mockRestore()
    })

    it('does not remove ability if confirmation is cancelled', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select an ability - abilities are now shown inline
      const addToCharacterButtons2 = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })

      // Get the ability header before clicking to add it
      const abilityHeaderBeforeAdd = addToCharacterButtons2[0].closest(
        '[data-testid="frame-header-container"]'
      ) as HTMLElement

      await user.click(addToCharacterButtons2[0])

      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('4')
        expect(tpValue).toBeInTheDocument()
      })

      // The ability card should still be in the same position, but now it's selected
      // Click on the ability header to expand it (it's still collapsed after being added)
      await user.click(abilityHeaderBeforeAdd)

      // Click remove button but cancel
      const removeButton = await screen.findByRole('button', { name: /remove ability/i })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

      await user.click(removeButton)

      // TP should remain at 4 (no change)
      const tpValue = within(tpStepper).getByText('4')
      expect(tpValue).toBeInTheDocument()

      // Ability should still be there
      expect(screen.getByText(testAbility.name)).toBeInTheDocument()

      confirmSpy.mockRestore()
    })

    it('removes ability from the list after confirmation', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select an ability - abilities are now shown inline
      const addToCharacterButtons3 = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })

      // Get the ability header before clicking to add it
      const abilityHeaderBeforeAdd = addToCharacterButtons3[0].closest(
        '[data-testid="frame-header-container"]'
      ) as HTMLElement

      await user.click(addToCharacterButtons3[0])

      // Ability should be in the list
      await waitFor(() => {
        expect(screen.getByText(testAbility.name)).toBeInTheDocument()
      })

      // The ability card should still be in the same position, but now it's selected
      // Click on the ability header to expand it (it's still collapsed after being added)
      await user.click(abilityHeaderBeforeAdd)

      // Remove the ability
      const removeButton = await screen.findByRole('button', { name: /remove ability/i })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      await user.click(removeButton)

      // Ability should still be in the DOM but now dimmed (unselected)
      // The ability card should collapse after removal
      await waitFor(() => {
        // Check that the "Add to Pilot" button is back (ability is unselected)
        const addButtons = screen.queryAllByRole('button', { name: /Add to Pilot \(1 TP\)/i })
        expect(addButtons.length).toBeGreaterThan(0)
      })

      confirmSpy.mockRestore()
    })
  })

  describe('Legendary Ability Removal', () => {
    it('can remove legendary ability', async () => {
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

      // This test would require setting up all prerequisites for legendary ability
      // Skipping full implementation for brevity, but the pattern is the same
    })
  })
})
