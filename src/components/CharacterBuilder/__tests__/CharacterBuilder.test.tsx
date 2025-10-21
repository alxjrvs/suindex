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

describe('CharacterBuilder', () => {
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
      legendaryAbilities: ['Legendary Salvage'],
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
  ]

  const mockAbilities: Ability[] = [
    {
      id: 'ability-hack-1',
      name: 'Basic Hack',
      tree: 'Hacking',
      level: 1,
      source: 'core',
      page: 30,
      description: 'A basic hacking ability',
      effect: 'Hack things',
      actionType: 'Turn',
      activationCost: 1,
    },
    {
      id: 'ability-hack-2',
      name: 'Advanced Hack',
      tree: 'Hacking',
      level: 2,
      source: 'core',
      page: 31,
      description: 'An advanced hacking ability',
      effect: 'Hack better things',
      actionType: 'Turn',
      activationCost: 2,
    },
    {
      id: 'ability-hack-3',
      name: 'Expert Hack',
      tree: 'Hacking',
      level: 3,
      source: 'core',
      page: 32,
      description: 'An expert hacking ability',
      effect: 'Hack the best things',
      actionType: 'Turn',
      activationCost: 2,
    },
    {
      id: 'ability-tech-1',
      name: 'Basic Tech',
      tree: 'Tech',
      level: 1,
      source: 'core',
      page: 33,
      description: 'A basic tech ability',
      effect: 'Use tech',
      actionType: 'Free',
      activationCost: 1,
    },
    {
      id: 'ability-advanced-hack-1',
      name: 'Advanced Hacking 1',
      tree: 'Advanced Hacking',
      level: 1,
      source: 'core',
      page: 40,
      description: 'First advanced ability',
      effect: 'Advanced hacking',
      actionType: 'Turn',
      activationCost: 2,
    },
    {
      id: 'ability-legendary',
      name: 'Ultimate Hack',
      tree: 'Advanced Hacking',
      level: 4,
      source: 'core',
      page: 50,
      description: 'The ultimate hack',
      effect: 'Hack everything',
      actionType: 'Turn',
      activationCost: 3,
    },
  ]

  const mockEquipment: Equipment[] = [
    {
      id: 'equipment-1',
      name: 'Hacking Tool',
      source: 'core',
      page: 60,
      description: 'A tool for hacking',
      techLevel: 1,
      traits: [],
    },
    {
      id: 'equipment-2',
      name: 'Repair Kit',
      source: 'core',
      page: 61,
      description: 'A kit for repairs',
      techLevel: 1,
      traits: [],
    },
  ]

  beforeEach(() => {
    vi.mocked(SalvageUnionReference.Classes.all).mockReturnValue(mockClasses)
    vi.mocked(SalvageUnionReference.Abilities.all).mockReturnValue(mockAbilities)
    vi.mocked(SalvageUnionReference.Equipment.all).mockReturnValue(mockEquipment)
    vi.mocked(SalvageUnionReference.AbilityTreeRequirements.all).mockReturnValue([])
  })

  describe('Initial Render', () => {
    it('renders the character builder interface', () => {
      render(<CharacterBuilder />)

      // Check for main sections by their content
      expect(screen.getByPlaceholderText(/enter callsign/i)).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /abilities/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /inventory/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /notes/i })).toBeInTheDocument()
    })

    it('displays all main sections', () => {
      render(<CharacterBuilder />)

      expect(screen.getByPlaceholderText(/enter callsign/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter motto/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter keepsake/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter background/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter appearance/i)).toBeInTheDocument()
    })

    it('shows class dropdown with core classes only', () => {
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      expect(classSelect).toBeInTheDocument()

      const options = classSelect.querySelectorAll('option')
      // Should have placeholder + 2 core classes (not hybrid)
      expect(options.length).toBe(3)
    })

    it('disables resource steppers when no class is selected', () => {
      render(<CharacterBuilder />)

      // HP, AP, and TP stepper buttons should be disabled
      const hpStepper = screen.getByRole('group', { name: /HP/i })
      const apStepper = screen.getByRole('group', { name: /^AP$/i })
      const tpStepper = screen.getByRole('group', { name: /TP/i })

      expect(hpStepper.querySelector('button[aria-label="Increment HP"]')).toBeDisabled()
      expect(hpStepper.querySelector('button[aria-label="Decrement HP"]')).toBeDisabled()
      expect(apStepper.querySelector('button[aria-label="Increment AP"]')).toBeDisabled()
      expect(apStepper.querySelector('button[aria-label="Decrement AP"]')).toBeDisabled()
      expect(tpStepper.querySelector('button[aria-label="Increment TP"]')).toBeDisabled()
      expect(tpStepper.querySelector('button[aria-label="Decrement TP"]')).toBeDisabled()
    })

    it('shows notes section', () => {
      render(<CharacterBuilder />)

      expect(screen.getByText(/^notes$/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/add notes about your character/i)).toBeInTheDocument()
    })
  })

  describe('Class Selection', () => {
    it('enables resource steppers when class is selected', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        // HP and AP start at max, so decrement buttons should be enabled
        const hpStepper = screen.getByRole('group', { name: /HP/i })
        const apStepper = screen.getByRole('group', { name: /^AP$/i })
        const tpStepper = screen.getByRole('group', { name: /TP/i })

        expect(hpStepper.querySelector('button[aria-label="Decrement HP"]')).not.toBeDisabled()
        expect(apStepper.querySelector('button[aria-label="Decrement AP"]')).not.toBeDisabled()
        expect(tpStepper.querySelector('button[aria-label="Increment TP"]')).not.toBeDisabled()
      })
    })

    it('initializes TP to 0 when class is selected', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        // Check TP stepper shows 0
        const tpStepper = screen.getByRole('group', { name: /TP/i })
        expect(tpStepper).toBeInTheDocument()
        expect(within(tpStepper).getByText('0')).toBeInTheDocument()
      })
    })

    it('shows advanced class dropdown as disabled initially', () => {
      render(<CharacterBuilder />)

      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      expect(advancedClassSelect).toBeDisabled()
    })

    it('resets character state when changing class', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class

      // Select first class
      await user.selectOptions(classSelect, 'class-hacker')

      // Change to second class
      await user.selectOptions(classSelect, 'class-salvager')

      await waitFor(() => {
        // Should reset TP to 0
        const tpStepper = screen.getByRole('group', { name: /TP/i })
        expect(tpStepper).toBeInTheDocument()
        expect(within(tpStepper).getByText('0')).toBeInTheDocument()
      })
    })
  })
})
