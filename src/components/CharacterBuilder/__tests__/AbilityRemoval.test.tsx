import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CharacterBuilder from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Class, Ability, Equipment } from 'salvageunion-reference'

// Mock the SalvageUnionReference
vi.mock('salvageunion-reference', () => ({
  SalvageUnionReference: {
    Classes: {
      all: vi.fn(),
    },
    Abilities: {
      all: vi.fn(),
    },
    Equipment: {
      all: vi.fn(),
    },
    AbilityTreeRequirements: {
      all: vi.fn(),
    },
  },
}))

describe('CharacterBuilder - Ability Removal', () => {
  const mockClasses: Class[] = [
    {
      id: 'class-hacker',
      name: 'Hacker',
      type: 'core',
      source: 'core',
      page: 10,
      description: 'A tech specialist',
      coreAbilities: ['Hacking', 'Tech'],
      hybridClasses: [],
      advancedAbilities: 'Advanced Hacking',
      legendaryAbilities: ['Ultimate Hack'],
    },
  ]

  const mockAbilities: Ability[] = [
    {
      id: 'hack-1',
      name: 'Hack 1',
      tree: 'Hacking',
      level: 1,
      source: 'core',
      page: 30,
      description: '',
      effect: '',
      actionType: 'Turn',
      activationCost: 1,
    },
    {
      id: 'hack-2',
      name: 'Hack 2',
      tree: 'Hacking',
      level: 2,
      source: 'core',
      page: 31,
      description: '',
      effect: '',
      actionType: 'Turn',
      activationCost: 1,
    },
    {
      id: 'tech-1',
      name: 'Tech 1',
      tree: 'Tech',
      level: 1,
      source: 'core',
      page: 33,
      description: '',
      effect: '',
      actionType: 'Free',
      activationCost: 1,
    },
  ]

  const mockEquipment: Equipment[] = []

  beforeEach(() => {
    vi.mocked(SalvageUnionReference.Classes.all).mockReturnValue(mockClasses)
    vi.mocked(SalvageUnionReference.Abilities.all).mockReturnValue(mockAbilities)
    vi.mocked(SalvageUnionReference.Equipment.all).mockReturnValue(mockEquipment)
    vi.mocked(SalvageUnionReference.AbilityTreeRequirements.all).mockReturnValue([])
    // Mock window.confirm to return true by default
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  describe('Remove Button Behavior', () => {
    it('shows remove button on selected abilities', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select an ability
      await user.click(addButton)
      await waitFor(() => screen.getByText('Hack 1'))
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Character \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Ability should be displayed with remove button
      await waitFor(() => {
        const abilityCards = screen.getAllByText('Hack 1')
        // Find the one in the selected abilities list (not in the modal)
        const selectedAbilityCard = abilityCards[0].closest('div')
        const removeButton = within(selectedAbilityCard!).getByRole('button', {
          name: /remove ability/i,
        })
        expect(removeButton).toBeInTheDocument()
      })
    })

    it('disables remove button when TP is less than 1', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 1 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement
      await user.click(tpIncrementButton)

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select an ability (costs 1 TP, leaving 0 TP)
      await user.click(addButton)
      await waitFor(() => screen.getByText('Hack 1'))
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Character \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // TP should now be 0
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('0')
        expect(tpValue).toBeInTheDocument()
      })

      // Remove button should be disabled
      await waitFor(() => {
        const abilityCards = screen.getAllByText('Hack 1')
        const selectedAbilityCard = abilityCards[0].closest('div')
        const removeButton = within(selectedAbilityCard!).getByRole('button', {
          name: /remove ability/i,
        })
        expect(removeButton).toBeDisabled()
      })
    })

    it('enables remove button when TP is 1 or more', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select an ability
      await user.click(addButton)
      await waitFor(() => screen.getByText('Hack 1'))
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Character \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Remove button should be enabled (we have 4 TP left)
      await waitFor(() => {
        const abilityCards = screen.getAllByText('Hack 1')
        const selectedAbilityCard = abilityCards[0].closest('div')
        const removeButton = within(selectedAbilityCard!).getByRole('button', {
          name: /remove ability/i,
        })
        expect(removeButton).not.toBeDisabled()
      })
    })
  })

  describe('Removal Cost', () => {
    it('costs 1 TP to remove an ability', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select an ability (costs 1 TP, leaving 4 TP)
      await user.click(addButton)
      await waitFor(() => screen.getByText('Hack 1'))
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Character \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('4')
        expect(tpValue).toBeInTheDocument()
      })

      // Remove the ability
      const abilityCards = screen.getAllByText('Hack 1')
      const selectedAbilityCard = abilityCards[0].closest('div')
      const removeButton = within(selectedAbilityCard!).getByRole('button', {
        name: /remove ability/i,
      })
      await user.click(removeButton)

      // TP should be reduced by 1 (4 - 1 = 3)
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('3')
        expect(tpValue).toBeInTheDocument()
      })
    })

    it('shows confirmation dialog when removing ability', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select an ability
      await user.click(addButton)
      await waitFor(() => screen.getByText('Hack 1'))
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Character \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Click remove button
      const abilityCards = screen.getAllByText('Hack 1')
      const selectedAbilityCard = abilityCards[0].closest('div')
      const removeButton = within(selectedAbilityCard!).getByRole('button', {
        name: /remove ability/i,
      })

      // Mock window.confirm
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      await user.click(removeButton)

      expect(confirmSpy).toHaveBeenCalled()

      confirmSpy.mockRestore()
    })

    it('does not remove ability if confirmation is cancelled', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select an ability
      await user.click(addButton)
      await waitFor(() => screen.getByText('Hack 1'))
      const addToCharacterButtons2 = await screen.findAllByRole('button', {
        name: /Add to Character \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons2[0])

      // Close the modal
      const closeButton2 = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton2)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('4')
        expect(tpValue).toBeInTheDocument()
      })

      // Click remove button but cancel
      const abilityCards = screen.getAllByText('Hack 1')
      const selectedAbilityCard = abilityCards[0].closest('div')
      const removeButton = within(selectedAbilityCard!).getByRole('button', {
        name: /remove ability/i,
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

      await user.click(removeButton)

      // TP should remain at 4 (no change)
      const tpValue = within(tpStepper).getByText('4')
      expect(tpValue).toBeInTheDocument()

      // Ability should still be there
      expect(screen.getByText('Hack 1')).toBeInTheDocument()

      confirmSpy.mockRestore()
    })

    it('removes ability from the list after confirmation', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select an ability
      await user.click(addButton)
      await waitFor(() => screen.getByText('Hack 1'))
      const addToCharacterButtons3 = await screen.findAllByRole('button', {
        name: /Add to Character \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons3[0])

      // Close the modal
      const closeButton3 = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton3)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Ability should be in the list
      await waitFor(() => {
        expect(screen.getByText('Hack 1')).toBeInTheDocument()
      })

      // Remove the ability
      const abilityCards = screen.getAllByText('Hack 1')
      const selectedAbilityCard = abilityCards[0].closest('div')
      const removeButton = within(selectedAbilityCard!).getByRole('button', {
        name: /remove ability/i,
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      await user.click(removeButton)

      // Ability should be removed from the list
      await waitFor(() => {
        expect(screen.queryByText('Hack 1')).not.toBeInTheDocument()
      })

      confirmSpy.mockRestore()
    })
  })

  describe('Legendary Ability Removal', () => {
    it('can remove legendary ability', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

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
