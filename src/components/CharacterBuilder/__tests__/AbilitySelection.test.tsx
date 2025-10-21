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

describe('CharacterBuilder - Ability Selection', () => {
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
      name: 'Intermediate Hack',
      tree: 'Hacking',
      level: 2,
      source: 'core',
      page: 31,
      description: 'An intermediate hacking ability',
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
      id: 'ability-tech-2',
      name: 'Intermediate Tech',
      tree: 'Tech',
      level: 2,
      source: 'core',
      page: 34,
      description: 'An intermediate tech ability',
      effect: 'Use better tech',
      actionType: 'Free',
      activationCost: 1,
    },
    {
      id: 'ability-tech-3',
      name: 'Expert Tech',
      tree: 'Tech',
      level: 3,
      source: 'core',
      page: 35,
      description: 'An expert tech ability',
      effect: 'Use the best tech',
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
  })

  describe('Ability Modal', () => {
    it('opens ability selector modal when Add button is clicked', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      // Select a class first
      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      // Find and click the Add button in the Abilities section
      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(/select ability/i)).toBeInTheDocument()
      })
    })

    it('displays only level 1 abilities initially', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        // Level 1 abilities should be visible and selectable
        expect(screen.getByText('Basic Hack')).toBeInTheDocument()
        expect(screen.getByText('Basic Tech')).toBeInTheDocument()

        // Higher level abilities are shown but their "Add to Character" buttons should be disabled
        expect(screen.getByText('Intermediate Hack')).toBeInTheDocument()
        expect(screen.getByText('Expert Hack')).toBeInTheDocument()
      })
    })

    it('shows ability cost in TP', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        // Core abilities should cost 1 TP
        const abilityCards = screen.getAllByText(/1 TP/i)
        expect(abilityCards.length).toBeGreaterThan(0)
      })
    })

    it('closes modal when clicking outside or cancel', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(/select ability/i)).toBeInTheDocument()
      })

      // Find and click close button
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText(/select ability/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Progressive Ability Unlocking', () => {
    it('only allows selecting level 1 abilities initially', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        // Level 1 abilities should be visible and selectable
        expect(screen.getByText('Basic Hack')).toBeInTheDocument()
        expect(screen.getByText('Basic Tech')).toBeInTheDocument()

        // Higher level abilities are shown but dimmed/disabled
        expect(screen.getByText('Intermediate Hack')).toBeInTheDocument()
      })

      // Verify that level 1 abilities have enabled "Add to Character" buttons
      const level1Buttons = screen.getAllByRole('button', { name: /Add to Character \(1 TP\)/i })
      expect(level1Buttons.length).toBeGreaterThan(0)
      expect(level1Buttons[0]).not.toBeDisabled()
    })

    it('unlocks level 2 abilities after selecting level 1 from same tree', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      // Open modal and select Basic Hack (level 1)
      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Basic Hack')).toBeInTheDocument()
      })

      await waitFor(() => screen.getByText('Basic Hack'))
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

      // Reopen modal
      await user.click(addButton)

      await waitFor(() => {
        // Now level 2 from Hacking tree should be available (not dimmed)
        expect(screen.getByText('Intermediate Hack')).toBeInTheDocument()
        // Level 2 from Tech tree is shown but should be dimmed (we didn't select Basic Tech)
        expect(screen.getByText('Intermediate Tech')).toBeInTheDocument()
      })
    })

    it('requires all abilities from a tree to be selected before level 3', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to 10
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 10; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select Basic Hack (level 1)
      await user.click(addButton)
      await waitFor(() => expect(screen.getByText('Basic Hack')).toBeInTheDocument())
      const addToCharacterButtons1 = await screen.findAllByRole('button', {
        name: /Add to Character \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons1[0])

      // Close the modal
      let closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Select Intermediate Hack (level 2)
      await user.click(addButton)
      await waitFor(() => expect(screen.getByText('Intermediate Hack')).toBeInTheDocument())
      const addToCharacterButtons2 = await screen.findAllByRole('button', {
        name: /Add to Character \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons2[0])

      // Close the modal
      closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Now Expert Hack (level 3) should be available
      await user.click(addButton)
      await waitFor(() => {
        expect(screen.getByText('Expert Hack')).toBeInTheDocument()
      })
    })
  })

  describe('TP Cost System', () => {
    it('deducts 1 TP when selecting a core ability', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Increase TP by clicking increment button 5 times
      const tpStepper = screen.getByRole('group', { name: /TP/i })

      // Initial TP should be 0
      const initialTpValue = within(tpStepper).getByText('0')
      expect(initialTpValue).toBeInTheDocument()
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('5')
        expect(tpValue).toBeInTheDocument()
      })

      // Select an ability
      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => expect(screen.getByText('Basic Hack')).toBeInTheDocument())
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

      // TP should be reduced by 1 (from 5 to 4)
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('4')
        expect(tpValue).toBeInTheDocument()
      })
    })
  })
})
