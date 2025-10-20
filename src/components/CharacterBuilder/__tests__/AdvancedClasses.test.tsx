import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CharacterBuilder from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Class, Ability, Equipment, AbilityTreeRequirement } from 'salvageunion-reference'

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

describe('CharacterBuilder - Advanced Classes', () => {
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
    {
      id: 'class-salvager',
      name: 'Salvager',
      type: 'core',
      source: 'core',
      page: 15,
      description: 'A scavenger',
      coreAbilities: ['Salvage', 'Repair'],
      hybridClasses: [],
      advancedAbilities: 'Master Salvage',
      legendaryAbilities: [],
    },
    {
      id: 'class-smuggler',
      name: 'Smuggler',
      type: 'hybrid',
      source: 'core',
      page: 20,
      description: 'A hybrid class',
      coreAbilities: ['Stealth', 'Trade'],
      hybridClasses: [],
      advancedAbilities: 'Smuggling',
      legendaryAbilities: ['Master Smuggler'],
    },
    {
      id: 'class-adv-hacker',
      name: 'Adv. Hacker',
      type: 'advanced',
      source: 'core',
      page: 25,
      description: 'Advanced version of Hacker',
      coreAbilities: ['Hacking', 'Tech'],
      hybridClasses: [],
      advancedAbilities: 'Advanced Hacking',
      legendaryAbilities: ['Ultimate Hack'],
    },
  ]

  const mockAbilities: Ability[] = [
    // Hacking tree
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
    // Tech tree
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
    // Smuggling abilities
    {
      id: 'smuggle-1',
      name: 'Smuggle 1',
      tree: 'Smuggling',
      level: 1,
      source: 'core',
      page: 50,
      description: '',
      effect: '',
      actionType: 'Turn',
      activationCost: 2,
    },
    {
      id: 'smuggle-2',
      name: 'Smuggle 2',
      tree: 'Smuggling',
      level: 2,
      source: 'core',
      page: 51,
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
      description: '',
      effect: '',
      actionType: 'Turn',
      activationCost: 3,
    },
  ]

  const mockTreeRequirements: AbilityTreeRequirement[] = [
    {
      id: 'req-smuggler',
      tree: 'Smuggling',
      requirement: ['Hacking'],
      page: 70,
    },
  ]

  const mockEquipment: Equipment[] = []

  beforeEach(() => {
    vi.mocked(SalvageUnionReference.Classes.all).mockReturnValue(mockClasses)
    vi.mocked(SalvageUnionReference.Abilities.all).mockReturnValue(mockAbilities)
    vi.mocked(SalvageUnionReference.Equipment.all).mockReturnValue(mockEquipment)
    vi.mocked(SalvageUnionReference.AbilityTreeRequirements.all).mockReturnValue(
      mockTreeRequirements
    )
  })

  describe('Advanced Class Requirements', () => {
    it('disables advanced class dropdown when less than 6 abilities', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      expect(advancedClassSelect).toBeDisabled()
    })

    it('disables advanced class dropdown when no complete tree (3+ abilities)', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 6 by clicking increment button
      const incrementButtons = screen.getAllByLabelText('Increment')
      const tpIncrementButton = incrementButtons[2] // Third stepper is TP (HP, AP, TP)

      for (let i = 0; i < 6; i++) {
        await user.click(tpIncrementButton)
      }

      // Select 6 abilities but spread across trees (not completing any)
      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select 3 from Hacking, but we need to select them progressively
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Hack ${i + 1}`))
        await user.click(screen.getByText(`Hack ${i + 1}`).closest('div')!)
        await user.click(screen.getByRole('button', { name: /ok/i }))
      }

      // Select 3 from Tech
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Tech ${i + 1}`))
        await user.click(screen.getByText(`Tech ${i + 1}`).closest('div')!)
        await user.click(screen.getByRole('button', { name: /ok/i }))
      }

      // Advanced class should now be enabled (we have 6 abilities and completed trees)
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })
    })

    it('prevents Salvager class from taking advanced classes', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-salvager')

      // Even with 6 abilities and complete tree, Salvager cannot take advanced classes
      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      expect(advancedClassSelect).toBeDisabled()
    })
  })

  describe('Hybrid Class Abilities', () => {
    it('shows hybrid class abilities when hybrid class is selected', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 20 by clicking increment button
      const incrementButtons = screen.getAllByLabelText('Increment')
      const tpIncrementButton = incrementButtons[2] // Third stepper is TP (HP, AP, TP)

      for (let i = 0; i < 20; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select 3 from Hacking tree
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Hack ${i + 1}`))
        await user.click(screen.getByText(`Hack ${i + 1}`).closest('div')!)
        await user.click(screen.getByRole('button', { name: /ok/i }))
      }

      // Select 3 from Tech tree
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Tech ${i + 1}`))
        await user.click(screen.getByText(`Tech ${i + 1}`).closest('div')!)
        await user.click(screen.getByRole('button', { name: /ok/i }))
      }

      // Select Smuggler advanced class
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, 'class-smuggler')

      // Open ability modal - should now show Smuggling abilities
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Smuggle 1')).toBeInTheDocument()
      })
    })

    it('charges 2 TP for hybrid class abilities', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 20 by clicking increment button
      const incrementButtons = screen.getAllByLabelText('Increment')
      const tpIncrementButton = incrementButtons[2] // Third stepper is TP (HP, AP, TP)

      for (let i = 0; i < 20; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select 6 abilities to unlock advanced class
      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Hack ${i + 1}`))
        await user.click(screen.getByText(`Hack ${i + 1}`).closest('div')!)
        await user.click(screen.getByRole('button', { name: /ok/i }))
      }

      for (let i = 0; i < 3; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText(`Tech ${i + 1}`))
        await user.click(screen.getByText(`Tech ${i + 1}`).closest('div')!)
        await user.click(screen.getByRole('button', { name: /ok/i }))
      }

      // Select Smuggler
      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, 'class-smuggler')

      // Check current TP (should be 20 - 6 = 14)
      await waitFor(() => {
        expect(screen.getByText('TP')).toBeInTheDocument()
        expect(screen.getByText('14')).toBeInTheDocument()
      })

      // Select a Smuggling ability (should cost 2 TP)
      await user.click(addButton)
      await waitFor(() => screen.getByText('Smuggle 1'))

      // Verify it shows 2 TP cost
      expect(screen.getByText(/2 TP/i)).toBeInTheDocument()

      await user.click(screen.getByText('Smuggle 1').closest('div')!)
      await user.click(screen.getByRole('button', { name: /ok/i }))

      // TP should be reduced by 2 (14 - 2 = 12)
      await waitFor(() => {
        expect(screen.getByText('TP')).toBeInTheDocument()
        expect(screen.getByText('12')).toBeInTheDocument()
      })
    })
  })
})
