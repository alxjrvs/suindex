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

describe('CharacterBuilder - Legendary Abilities', () => {
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
    // Core abilities
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
      id: 'hack-3',
      name: 'Hack 3',
      tree: 'Hacking',
      level: 3,
      source: 'core',
      page: 32,
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
    {
      id: 'tech-2',
      name: 'Tech 2',
      tree: 'Tech',
      level: 2,
      source: 'core',
      page: 34,
      description: '',
      effect: '',
      actionType: 'Free',
      activationCost: 1,
    },
    {
      id: 'tech-3',
      name: 'Tech 3',
      tree: 'Tech',
      level: 3,
      source: 'core',
      page: 35,
      description: '',
      effect: '',
      actionType: 'Free',
      activationCost: 1,
    },
    // Advanced abilities
    {
      id: 'adv-hack-1',
      name: 'Adv Hack 1',
      tree: 'Advanced Hacking',
      level: 1,
      source: 'core',
      page: 40,
      description: '',
      effect: '',
      actionType: 'Turn',
      activationCost: 2,
    },
    {
      id: 'adv-hack-2',
      name: 'Adv Hack 2',
      tree: 'Advanced Hacking',
      level: 2,
      source: 'core',
      page: 41,
      description: '',
      effect: '',
      actionType: 'Turn',
      activationCost: 2,
    },
    {
      id: 'adv-hack-3',
      name: 'Adv Hack 3',
      tree: 'Advanced Hacking',
      level: 3,
      source: 'core',
      page: 42,
      description: '',
      effect: '',
      actionType: 'Turn',
      activationCost: 2,
    },
    // Legendary
    {
      id: 'legendary-1',
      name: 'Ultimate Hack',
      tree: 'Advanced Hacking',
      level: 4,
      source: 'core',
      page: 60,
      description: 'The ultimate hack',
      effect: 'Hack everything',
      actionType: 'Turn',
      activationCost: 3,
    },
  ]

  const mockEquipment: Equipment[] = []

  beforeEach(() => {
    vi.mocked(SalvageUnionReference.Classes.all).mockReturnValue(mockClasses)
    vi.mocked(SalvageUnionReference.Abilities.all).mockReturnValue(mockAbilities)
    vi.mocked(SalvageUnionReference.Equipment.all).mockReturnValue(mockEquipment)
    vi.mocked(SalvageUnionReference.AbilityTreeRequirements.all).mockReturnValue([])
    // Mock window.confirm to always return true
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  describe('Legendary Ability Requirements', () => {
    it('does not show legendary abilities until all advanced abilities are selected', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

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
        await waitFor(() => screen.getByText(`Hack ${i + 1}`))
        await user.click(screen.getByText(`Hack ${i + 1}`).closest('div')!)
      }

      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Tech ${i + 1}`))
        await user.click(screen.getByText(`Tech ${i + 1}`).closest('div')!)
      }

      // Select advanced class
      const advancedClassSelect = screen.getByLabelText(/advanced class/i)
      await user.selectOptions(advancedClassSelect, 'class-hacker')

      // Select only 2 advanced abilities (not all 3)
      await user.click(addButton)
      await waitFor(() => screen.getByText('Adv Hack 1'))
      await user.click(screen.getByText('Adv Hack 1').closest('div')!)

      await user.click(addButton)
      await waitFor(() => screen.getByText('Adv Hack 2'))
      await user.click(screen.getByText('Adv Hack 2').closest('div')!)

      // Open modal - legendary should NOT be visible yet
      await user.click(addButton)
      await waitFor(() => {
        expect(screen.queryByText('Ultimate Hack')).not.toBeInTheDocument()
      })
    })

    it('shows legendary abilities after all advanced abilities are selected', async () => {
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

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select 6 core abilities
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Hack ${i + 1}`))
        await user.click(screen.getByText(`Hack ${i + 1}`).closest('div')!)
      }

      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Tech ${i + 1}`))
        await user.click(screen.getByText(`Tech ${i + 1}`).closest('div')!)
      }

      // Select advanced class
      const advancedClassSelect = screen.getByLabelText(/advanced class/i)
      await user.selectOptions(advancedClassSelect, 'class-hacker')

      // Select all 3 advanced abilities
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Adv Hack ${i + 1}`))
        await user.click(screen.getByText(`Adv Hack ${i + 1}`).closest('div')!)
      }

      // Open modal - legendary should now be visible
      await user.click(addButton)
      await waitFor(() => {
        expect(screen.getByText('Ultimate Hack')).toBeInTheDocument()
      })
    })

    it('requires 3 TP to select legendary ability', async () => {
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

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select all required abilities
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Hack ${i + 1}`))
        await user.click(screen.getByText(`Hack ${i + 1}`).closest('div')!)
      }

      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Tech ${i + 1}`))
        await user.click(screen.getByText(`Tech ${i + 1}`).closest('div')!)
      }

      const advancedClassSelect = screen.getByLabelText(/advanced class/i)
      await user.selectOptions(advancedClassSelect, 'class-hacker')

      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Adv Hack ${i + 1}`))
        await user.click(screen.getByText(`Adv Hack ${i + 1}`).closest('div')!)
      }

      // Check current TP (30 - 6 core - 6 advanced = 18)
      await waitFor(() => {
        expect(screen.getByText(/18 TP/i)).toBeInTheDocument()
      })

      // Select legendary ability
      await user.click(addButton)
      await waitFor(() => screen.getByText('Ultimate Hack'))

      // Verify it shows 3 TP cost
      expect(screen.getByText(/3 TP/i)).toBeInTheDocument()

      await user.click(screen.getByText('Ultimate Hack').closest('div')!)

      // TP should be reduced by 3 (18 - 3 = 15)
      await waitFor(() => {
        expect(screen.getByText(/15 TP/i)).toBeInTheDocument()
      })
    })

    it('only allows one legendary ability to be selected', async () => {
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

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select all required abilities
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Hack ${i + 1}`))
        await user.click(screen.getByText(`Hack ${i + 1}`).closest('div')!)
      }

      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Tech ${i + 1}`))
        await user.click(screen.getByText(`Tech ${i + 1}`).closest('div')!)
      }

      const advancedClassSelect = screen.getByLabelText(/advanced class/i)
      await user.selectOptions(advancedClassSelect, 'class-hacker')

      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Adv Hack ${i + 1}`))
        await user.click(screen.getByText(`Adv Hack ${i + 1}`).closest('div')!)
      }

      // Select legendary ability
      await user.click(addButton)
      await waitFor(() => screen.getByText('Ultimate Hack'))
      await user.click(screen.getByText('Ultimate Hack').closest('div')!)

      // Legendary ability should now be displayed in the abilities list
      await waitFor(() => {
        expect(screen.getByText('Ultimate Hack')).toBeInTheDocument()
      })

      // Open modal again - legendary section should not appear (already selected one)
      await user.click(addButton)
      await waitFor(() => {
        // The modal should be open but legendary section should not be visible
        const legendarySection = screen.queryByText(/legendary abilities/i)
        expect(legendarySection).not.toBeInTheDocument()
      })
    })
  })
})
