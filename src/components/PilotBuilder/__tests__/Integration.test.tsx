import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PilotBuilder from '../index'
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

describe('PilotBuilder - Integration Tests', () => {
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
    // Hacking tree
    {
      id: 'hack-1',
      name: 'Hack 1',
      tree: 'Hacking',
      level: 1,
      source: 'core',
      page: 30,
      description: 'Basic hack',
      effect: 'Hack things',
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
      description: 'Better hack',
      effect: 'Hack better',
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
      description: 'Best hack',
      effect: 'Hack best',
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
      description: 'Basic tech',
      effect: 'Use tech',
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
      description: 'Better tech',
      effect: 'Use better tech',
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
      description: 'Best tech',
      effect: 'Use best tech',
      actionType: 'Free',
      activationCost: 1,
    },
    // Advanced abilities
    {
      id: 'adv-1',
      name: 'Adv Hack 1',
      tree: 'Advanced Hacking',
      level: 1,
      source: 'core',
      page: 40,
      description: 'Advanced',
      effect: 'Advanced hack',
      actionType: 'Turn',
      activationCost: 2,
    },
    {
      id: 'adv-2',
      name: 'Adv Hack 2',
      tree: 'Advanced Hacking',
      level: 2,
      source: 'core',
      page: 41,
      description: 'Advanced',
      effect: 'Advanced hack',
      actionType: 'Turn',
      activationCost: 2,
    },
    {
      id: 'adv-3',
      name: 'Adv Hack 3',
      tree: 'Advanced Hacking',
      level: 3,
      source: 'core',
      page: 42,
      description: 'Advanced',
      effect: 'Advanced hack',
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
      description: 'Smuggle',
      effect: 'Smuggle things',
      actionType: 'Turn',
      activationCost: 2,
    },
    // Legendary
    {
      id: 'legendary',
      name: 'Ultimate Hack',
      tree: 'Advanced Hacking',
      level: 4,
      source: 'core',
      page: 60,
      description: 'Ultimate',
      effect: 'Ultimate hack',
      actionType: 'Turn',
      activationCost: 3,
    },
  ]

  const mockEquipment: Equipment[] = [
    {
      id: 'eq-1',
      name: 'Tool 1',
      source: 'core',
      page: 70,
      description: 'A tool',
      techLevel: 1,
      traits: [],
    },
    {
      id: 'eq-2',
      name: 'Tool 2',
      source: 'core',
      page: 71,
      description: 'Another tool',
      techLevel: 1,
      traits: [],
    },
  ]

  const mockTreeRequirements: AbilityTreeRequirement[] = [
    {
      id: 'req-smuggler',
      tree: 'Smuggling',
      requirement: ['Hacking'],
      page: 80,
    },
  ]

  beforeEach(() => {
    vi.mocked(SalvageUnionReference.Classes.all).mockReturnValue(mockClasses)
    vi.mocked(SalvageUnionReference.Abilities.all).mockReturnValue(mockAbilities)
    vi.mocked(SalvageUnionReference.Equipment.all).mockReturnValue(mockEquipment)
    vi.mocked(SalvageUnionReference.AbilityTreeRequirements.all).mockReturnValue(
      mockTreeRequirements
    )
    // Mock window.confirm to always return true
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  describe('Complete Pilot Creation Flow', () => {
    it('creates a complete character from start to finish', async () => {
      const user = userEvent.setup()
      render(<PilotBuilder />)

      // Step 1: Fill in pilot information
      await user.type(screen.getByPlaceholderText(/enter callsign/i), 'Ghost')
      await user.type(screen.getByPlaceholderText(/enter motto/i), 'Never give up')
      await user.type(screen.getByPlaceholderText(/enter keepsake/i), 'Lucky coin')
      await user.type(screen.getByPlaceholderText(/enter background/i), 'Former soldier')
      await user.type(screen.getByPlaceholderText(/enter appearance/i), 'Tall with dark hair')

      // Step 2: Select class
      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Step 3: Set resources
      await waitFor(() => {
        const tpStepper = screen.getByRole('group', { name: /TP/i })
        const tpIncrementButton = tpStepper.querySelector('button[aria-label="Increment TP"]')
        expect(tpIncrementButton).not.toBeDisabled()
      })

      // Increase TP to 20 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 20; i++) {
        await user.click(tpIncrementButton)
      }

      // Step 4: Select 6 core abilities
      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addAbilityButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select 3 from Hacking tree
      for (let i = 0; i < 3; i++) {
        await user.click(addAbilityButton)
        // Wait for the "Add to Pilot" buttons to appear in the modal
        const addButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        // Click the first available button
        await user.click(addButtons[0])
      }

      // Select 3 from Tech tree
      for (let i = 0; i < 3; i++) {
        await user.click(addAbilityButton)
        // Wait for the "Add to Pilot" buttons to appear in the modal
        const addButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        // Click the first available button
        await user.click(addButtons[0])
      }

      // Step 5: Select advanced class
      await waitFor(() => {
        const advancedClassSelect = screen.getByLabelText(/advanced class/i)
        expect(advancedClassSelect).not.toBeDisabled()
      })

      const advancedClassSelect = screen.getByLabelText(/advanced class/i)
      await user.selectOptions(advancedClassSelect, 'class-smuggler')

      // Step 6: Select hybrid class ability
      await user.click(addAbilityButton)
      await waitFor(() => screen.getByText('Smuggle 1'))
      // Click the "Add to Pilot" button (advanced ability costs 2 TP)
      const smuggleAddButton = await screen.findByRole('button', {
        name: /Add to Pilot \(2 TP\)/i,
      })
      await user.click(smuggleAddButton)

      // Step 7: Add equipment
      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addEquipmentButton = within(inventorySection!).getByRole('button', { name: '+' })

      await user.click(addEquipmentButton)
      // Wait for the equipment selector modal to open and find the button containing "Tool 1"
      const tool1Button = await screen.findByRole('button', { name: /Tool 1/i })
      await user.click(tool1Button)

      // Wait for modal to close and reopen for second equipment
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Tool 1/i })).not.toBeInTheDocument()
      })

      await user.click(addEquipmentButton)
      const tool2Button = await screen.findByRole('button', { name: /Tool 2/i })
      await user.click(tool2Button)

      // Step 8: Add notes
      await user.type(
        screen.getByPlaceholderText(/add notes about your pilot/i),
        'A skilled hacker turned smuggler'
      )

      // Verify final state
      await waitFor(() => {
        // Pilot info
        expect(screen.getByPlaceholderText(/enter callsign/i)).toHaveValue('Ghost')
        expect(screen.getByPlaceholderText(/enter motto/i)).toHaveValue('Never give up')

        // Abilities (6 core + 1 hybrid = 7 total) - check that they exist (may be multiple instances)
        expect(screen.getAllByText('Hack 1').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Hack 2').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Hack 3').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Tech 1').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Tech 2').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Tech 3').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Smuggle 1').length).toBeGreaterThan(0)

        // Equipment - check that equipment was added (count should be 2/6)
        expect(within(inventorySection!).getByText(/2\/6/)).toBeInTheDocument()
        // Check that Tool 1 and Tool 2 exist somewhere in the document (they should be in inventory)
        expect(screen.getAllByText('Tool 1').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Tool 2').length).toBeGreaterThan(0)

        // TP (20 - 6 core - 2 hybrid = 12) - find the TP stepper and check its value
        const tpStepper = screen.getByLabelText('Increment TP').closest('div')!.parentElement!
        expect(within(tpStepper).getByText('12')).toBeInTheDocument()

        // Notes
        expect(screen.getByPlaceholderText(/add notes about your pilot/i)).toHaveValue(
          'A skilled hacker turned smuggler'
        )
      })
    })

    it('handles ability selection with insufficient TP', async () => {
      const user = userEvent.setup()
      render(<PilotBuilder />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Set TP to only 1
      await waitFor(() => {
        const tpStepper = screen.getByRole('group', { name: /TP/i })
        const tpIncrementButton = tpStepper.querySelector(
          'button[aria-label="Increment TP"]'
        ) as HTMLButtonElement
        expect(tpIncrementButton).not.toBeDisabled()
      })

      // Increase TP to 1 by clicking increment button once
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement
      await user.click(tpIncrementButton)

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select first ability (costs 1 TP)
      await user.click(addButton)
      // Wait for the "Add to Pilot" buttons to appear in the modal
      const hack1AddButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })
      await user.click(hack1AddButtons[0])

      // TP should now be 0
      await waitFor(() => {
        const tpStepper = screen.getByLabelText('Increment TP').closest('div')!.parentElement!
        expect(within(tpStepper).getByText('0')).toBeInTheDocument()
      })

      // Try to open the modal again - the add button should be disabled since TP is 0
      await waitFor(() => {
        expect(addButton).toBeDisabled()
      })
    })
  })

  describe('State Consistency', () => {
    it('maintains consistent state when changing classes', async () => {
      const user = userEvent.setup()
      render(<PilotBuilder />)

      // Select first class and add abilities
      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Increase TP to 10 by clicking increment button
      const tpIncrementButton = screen.getByLabelText('Increment TP')

      for (let i = 0; i < 10; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      await user.click(addButton)
      // Wait for the "Add to Pilot" buttons to appear in the modal
      const hack1AddButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })
      await user.click(hack1AddButtons[0])

      // Verify ability was added
      await waitFor(() => {
        const hack1Elements = screen.getAllByText('Hack 1')
        expect(hack1Elements.length).toBeGreaterThan(0)
      })

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Change class - should reset abilities
      await user.selectOptions(classSelect, '')
      await user.selectOptions(classSelect, 'class-hacker')

      // Abilities should be cleared (no Hack 1 in the selected abilities list)
      await waitFor(() => {
        const hack1Elements = screen.queryAllByText('Hack 1')
        // Should not find any Hack 1 elements after clearing
        expect(hack1Elements.length).toBe(0)
      })
    })

    it('preserves pilot information when changing classes', async () => {
      const user = userEvent.setup()
      render(<PilotBuilder />)

      // Fill in pilot info
      await user.type(screen.getByPlaceholderText(/enter callsign/i), 'Ghost')
      await user.type(screen.getByPlaceholderText(/enter motto/i), 'Never give up')

      // Select class
      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, 'class-hacker')

      // Change class
      await user.selectOptions(classSelect, '')

      // Pilot info should be preserved
      expect(screen.getByPlaceholderText(/enter callsign/i)).toHaveValue('Ghost')
      expect(screen.getByPlaceholderText(/enter motto/i)).toHaveValue('Never give up')
    })
  })
})
