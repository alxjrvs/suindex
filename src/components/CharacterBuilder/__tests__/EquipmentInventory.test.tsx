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

describe('CharacterBuilder - Equipment Inventory', () => {
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
      legendaryAbilities: [],
    },
  ]

  const mockAbilities: Ability[] = []

  const mockEquipment: Equipment[] = [
    {
      id: 'equipment-1',
      name: 'Hacking Tool',
      source: 'core',
      page: 60,
      description: 'A tool for hacking',
      techLevel: 1,
      salvageValue: 10,
      traits: [],
    },
    {
      id: 'equipment-2',
      name: 'Repair Kit',
      source: 'core',
      page: 61,
      description: 'A kit for repairs',
      techLevel: 1,
      salvageValue: 15,
      traits: [],
    },
    {
      id: 'equipment-3',
      name: 'Scanner',
      source: 'core',
      page: 62,
      description: 'A scanning device',
      techLevel: 2,
      salvageValue: 20,
      traits: [],
    },
  ]

  beforeEach(() => {
    vi.mocked(SalvageUnionReference.Classes.all).mockReturnValue(mockClasses)
    vi.mocked(SalvageUnionReference.Abilities.all).mockReturnValue(mockAbilities)
    vi.mocked(SalvageUnionReference.Equipment.all).mockReturnValue(mockEquipment)
    vi.mocked(SalvageUnionReference.AbilityTreeRequirements.all).mockReturnValue([])
  })

  describe('Inventory Display', () => {
    it('shows inventory section', () => {
      render(<CharacterBuilder />)

      expect(screen.getByText(/^inventory$/i)).toBeInTheDocument()
    })

    it('shows equipment count as 0/6 initially', () => {
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      expect(within(inventorySection!).getByText(/0\/6/)).toBeInTheDocument()
    })

    it('shows Add button for equipment', () => {
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })
      expect(addButton).toBeInTheDocument()
    })

    it('does not show empty slot placeholders', () => {
      render(<CharacterBuilder />)

      // Should not show dashed boxes or "—" symbols for empty slots
      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const emptySlots = within(inventorySection!).queryAllByText('—')
      expect(emptySlots.length).toBe(0)
    })
  })

  describe('Adding Equipment', () => {
    it('opens equipment selector modal when Add button is clicked', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(/select equipment/i)).toBeInTheDocument()
      })
    })

    it('displays available equipment in modal', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Hacking Tool')).toBeInTheDocument()
        expect(screen.getByText('Repair Kit')).toBeInTheDocument()
        expect(screen.getByText('Scanner')).toBeInTheDocument()
      })
    })

    it('adds equipment to inventory when selected', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => screen.getByText('Hacking Tool'))

      const equipmentCard = screen.getByText('Hacking Tool').closest('div')
      await user.click(equipmentCard!)

      // Equipment should be added to inventory
      await waitFor(() => {
        const inventory = screen.getByText(/^inventory$/i).closest('div')
        expect(within(inventory!).getByText('Hacking Tool')).toBeInTheDocument()
      })
    })

    it('updates equipment count when adding equipment', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      // Add first equipment
      await user.click(addButton)
      await waitFor(() => screen.getByText('Hacking Tool'))
      await user.click(screen.getByText('Hacking Tool').closest('div')!)

      await waitFor(() => {
        expect(within(inventorySection!).getByText(/1\/6/)).toBeInTheDocument()
      })

      // Add second equipment
      await user.click(addButton)
      await waitFor(() => screen.getByText('Repair Kit'))
      await user.click(screen.getByText('Repair Kit').closest('div')!)

      await waitFor(() => {
        expect(within(inventorySection!).getByText(/2\/6/)).toBeInTheDocument()
      })
    })

    it('closes modal after selecting equipment', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => screen.getByText('Hacking Tool'))
      await user.click(screen.getByText('Hacking Tool').closest('div')!)

      await waitFor(() => {
        expect(screen.queryByText(/select equipment/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Inventory Capacity', () => {
    it('disables Add button when inventory is full (6/6)', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      // Add 6 items
      for (let i = 0; i < 6; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText('Hacking Tool'))
        await user.click(screen.getByText('Hacking Tool').closest('div')!)
      }

      // Add button should now be disabled
      await waitFor(() => {
        expect(addButton).toBeDisabled()
      })
    })

    it('shows 6/6 when inventory is full', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      // Add 6 items
      for (let i = 0; i < 6; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText('Hacking Tool'))
        await user.click(screen.getByText('Hacking Tool').closest('div')!)
      }

      await waitFor(() => {
        expect(within(inventorySection!).getByText(/6\/6/)).toBeInTheDocument()
      })
    })

    it('enables Add button after removing equipment from full inventory', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      // Add 6 items
      for (let i = 0; i < 6; i++) {
        await user.click(addButton)
        await waitFor(() => screen.getByText('Hacking Tool'))
        await user.click(screen.getByText('Hacking Tool').closest('div')!)
      }

      // Add button should be disabled
      await waitFor(() => {
        expect(addButton).toBeDisabled()
      })

      // Remove one item
      const equipmentCards = screen.getAllByText('Hacking Tool')
      const firstCard = equipmentCards[0].closest('div')
      const removeButton = within(firstCard!).getByRole('button', { name: /✕/i })
      await user.click(removeButton)

      // Add button should be enabled again
      await waitFor(() => {
        expect(addButton).not.toBeDisabled()
      })
    })
  })

  describe('Removing Equipment', () => {
    it('shows remove button on each equipment item', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      await user.click(addButton)
      await waitFor(() => screen.getByText('Hacking Tool'))
      await user.click(screen.getByText('Hacking Tool').closest('div')!)

      await waitFor(() => {
        const equipmentCard = screen.getByText('Hacking Tool').closest('div')
        const removeButton = within(equipmentCard!).getByRole('button', { name: /✕/i })
        expect(removeButton).toBeInTheDocument()
      })
    })

    it('removes equipment when remove button is clicked', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      await user.click(addButton)
      await waitFor(() => screen.getByText('Hacking Tool'))
      await user.click(screen.getByText('Hacking Tool').closest('div')!)

      await waitFor(() => {
        expect(screen.getByText('Hacking Tool')).toBeInTheDocument()
      })

      const equipmentCard = screen.getByText('Hacking Tool').closest('div')
      const removeButton = within(equipmentCard!).getByRole('button', { name: /✕/i })
      await user.click(removeButton)

      await waitFor(() => {
        expect(screen.queryByText('Hacking Tool')).not.toBeInTheDocument()
      })
    })

    it('updates equipment count when removing equipment', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      // Add two items
      await user.click(addButton)
      await waitFor(() => screen.getByText('Hacking Tool'))
      await user.click(screen.getByText('Hacking Tool').closest('div')!)

      await user.click(addButton)
      await waitFor(() => screen.getByText('Repair Kit'))
      await user.click(screen.getByText('Repair Kit').closest('div')!)

      await waitFor(() => {
        expect(within(inventorySection!).getByText(/2\/6/)).toBeInTheDocument()
      })

      // Remove one item
      const equipmentCard = screen.getByText('Hacking Tool').closest('div')
      const removeButton = within(equipmentCard!).getByRole('button', { name: /✕/i })
      await user.click(removeButton)

      await waitFor(() => {
        expect(within(inventorySection!).getByText(/1\/6/)).toBeInTheDocument()
      })
    })
  })
})
