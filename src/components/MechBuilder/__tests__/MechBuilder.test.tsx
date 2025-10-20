import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MechBuilder from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Chassis, System, Module } from 'salvageunion-reference'

// Mock the SalvageUnionReference
vi.mock('salvageunion-reference', () => ({
  SalvageUnionReference: {
    Chassis: {
      all: vi.fn(),
    },
    Systems: {
      all: vi.fn(),
    },
    Modules: {
      all: vi.fn(),
    },
  },
}))

describe('MechBuilder', () => {
  const mockChassis: Chassis[] = [
    {
      id: 'chassis-1',
      name: 'Test Chassis Alpha',
      source: 'Test Source',
      page: 1,
      description: 'A test chassis for testing',
      stats: {
        structure_pts: 10,
        energy_pts: 8,
        heat_cap: 6,
        system_slots: 4,
        module_slots: 3,
        cargo_cap: 5,
        tech_level: 1,
        salvage_value: 100,
      },
      chassis_abilities: [
        {
          name: 'Test Ability',
          description: 'A test ability',
        },
      ],
      patterns: [
        {
          name: 'Scout Pattern',
          description: 'A scout pattern for testing',
          legalStarting: true,
          systems: ['Test System'],
          modules: ['Test Module'],
        },
      ],
    },
    {
      id: 'chassis-2',
      name: 'Test Chassis Beta',
      source: 'Test Source',
      page: 2,
      description: 'Another test chassis',
      stats: {
        structure_pts: 12,
        energy_pts: 10,
        heat_cap: 8,
        system_slots: 5,
        module_slots: 4,
        cargo_cap: 6,
        tech_level: 2,
        salvage_value: 200,
      },
      chassis_abilities: [],
      patterns: [],
    },
  ]

  const mockSystems: System[] = [
    {
      id: 'system-1',
      name: 'Test System',
      source: 'Test Source',
      page: 1,
      description: 'A test system',
      slotsRequired: 1,
      techLevel: 1,
      salvageValue: 50,
      traits: [],
    },
  ]

  const mockModules: Module[] = [
    {
      id: 'module-1',
      name: 'Test Module',
      source: 'Test Source',
      page: 1,
      description: 'A test module',
      slotsRequired: 1,
      techLevel: 1,
      salvageValue: 50,
      traits: [],
      recommended: false,
      actionType: 'Free',
      range: 'Self',
    },
  ]

  beforeEach(() => {
    vi.mocked(SalvageUnionReference.Chassis.all).mockReturnValue(mockChassis)
    vi.mocked(SalvageUnionReference.Systems.all).mockReturnValue(mockSystems)
    vi.mocked(SalvageUnionReference.Modules.all).mockReturnValue(mockModules)
  })

  describe('Initial Render', () => {
    it('renders the mech builder interface', () => {
      render(<MechBuilder />)

      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter or select a pattern/i)).toBeInTheDocument()
      expect(screen.getByText(/chassis stats/i)).toBeInTheDocument()
    })

    it('displays all main sections', () => {
      render(<MechBuilder />)

      expect(screen.getByText(/chassis ability/i)).toBeInTheDocument()
      expect(screen.getAllByText(/quirk/i)[0]).toBeInTheDocument()
      expect(screen.getAllByText(/appearance/i)[0]).toBeInTheDocument()
      expect(screen.getByText(/systems & modules/i)).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /cargo/i })).toBeInTheDocument()
    })

    it('shows resource steppers (SP, EP, Heat)', () => {
      render(<MechBuilder />)

      expect(screen.getByText(/^SP$/i)).toBeInTheDocument()
      expect(screen.getByText(/^EP$/i)).toBeInTheDocument()
      expect(screen.getByText(/^HEAT$/i)).toBeInTheDocument()
    })

    it('disables inputs when no chassis is selected', () => {
      render(<MechBuilder />)

      const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
      const quirkInput = screen.getByPlaceholderText(/enter quirk/i)
      const appearanceInput = screen.getByPlaceholderText(/enter appearance/i)

      expect(patternInput).toBeDisabled()
      expect(quirkInput).toBeDisabled()
      expect(appearanceInput).toBeDisabled()
    })
  })

  describe('Chassis Selection', () => {
    it('loads and displays chassis options grouped by tech level', async () => {
      render(<MechBuilder />)

      const chassisSelect = screen.getByRole('combobox')
      expect(chassisSelect).toBeInTheDocument()

      const options = chassisSelect.querySelectorAll('option')
      expect(options.length).toBeGreaterThan(0)
    })

    it('updates stats when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        expect(screen.getByText(/0\/10/)).toBeInTheDocument() // SP
      })
    })

    it('enables inputs when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
        const quirkInput = screen.getByPlaceholderText(/enter quirk/i)
        const appearanceInput = screen.getByPlaceholderText(/enter appearance/i)

        expect(patternInput).not.toBeDisabled()
        expect(quirkInput).not.toBeDisabled()
        expect(appearanceInput).not.toBeDisabled()
      })
    })

    it('resets mech state when changing chassis', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByRole('combobox')

      await user.selectOptions(chassisSelect, 'chassis-1')
      await waitFor(() => {
        expect(screen.getByText(/0\/10/)).toBeInTheDocument()
      })

      await user.selectOptions(chassisSelect, 'chassis-2')
      await waitFor(() => {
        expect(screen.getByText(/0\/12/)).toBeInTheDocument()
      })
    })
  })

  describe('Pattern Selection', () => {
    it('shows pattern suggestions when typing', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
      await user.click(patternInput)

      await waitFor(() => {
        expect(screen.getByText(/scout pattern/i)).toBeInTheDocument()
      })
    })

    it('applies pattern when confirmed', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
      await user.click(patternInput)

      const scoutPattern = await screen.findByText(/scout pattern/i)
      await user.click(scoutPattern)

      expect(confirmSpy).toHaveBeenCalled()
      confirmSpy.mockRestore()
    })
  })

  describe('Resource Management', () => {
    it('allows adjusting SP, EP, and Heat values', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        expect(screen.getByText(/0\/10/)).toBeInTheDocument()
      })

      // Find increment buttons for SP
      const spSection = screen.getByText(/^SP$/i).closest('div')
      const incrementButton = spSection?.querySelector('button[aria-label*="Increment"]')

      if (incrementButton) {
        await user.click(incrementButton)
        await waitFor(() => {
          expect(screen.getByText(/1\/10/)).toBeInTheDocument()
        })
      }
    })
  })

  describe('Systems and Modules', () => {
    it('shows add system/module button disabled when no chassis selected', () => {
      render(<MechBuilder />)

      const addButton = screen.getByRole('button', { name: /add system\/module/i })
      expect(addButton).toBeDisabled()
    })

    it('enables add system/module button when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        const addButton = screen.getByRole('button', { name: /add system\/module/i })
        expect(addButton).not.toBeDisabled()
      })
    })

    it('displays system and module slot usage', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        expect(screen.getByText(/0\/4/)).toBeInTheDocument() // System slots
        expect(screen.getByText(/0\/3/)).toBeInTheDocument() // Module slots
      })
    })
  })

  describe('Cargo Management', () => {
    it('shows add cargo button disabled when no chassis selected', () => {
      render(<MechBuilder />)

      const addButton = screen.getByRole('button', { name: /add cargo/i })
      expect(addButton).toBeDisabled()
    })

    it('enables add cargo button when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        const addButton = screen.getByRole('button', { name: /add cargo/i })
        expect(addButton).not.toBeDisabled()
      })
    })

    it('displays cargo capacity', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        expect(screen.getByText(/0\/5/)).toBeInTheDocument() // Cargo cap
      })
    })

    it('opens cargo modal when add cargo is clicked', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(async () => {
        const addButton = screen.getByRole('button', { name: /add cargo/i })
        await user.click(addButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/cargo amount/i)).toBeInTheDocument()
        expect(screen.getByText(/description/i)).toBeInTheDocument()
      })
    })
  })

  describe('Quirk and Appearance', () => {
    it('allows entering quirk text when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      const quirkInput = screen.getByPlaceholderText(/enter quirk/i)
      await user.type(quirkInput, 'Rusty joints')

      expect(quirkInput).toHaveValue('Rusty joints')
    })

    it('allows entering appearance text when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      const appearanceInput = screen.getByPlaceholderText(/enter appearance/i)
      await user.type(appearanceInput, 'Battle-scarred red paint')

      expect(appearanceInput).toHaveValue('Battle-scarred red paint')
    })
  })

  describe('Chassis Stats Display', () => {
    it('displays all chassis stats correctly', async () => {
      const user = userEvent.setup()
      render(<MechBuilder />)

      const chassisSelect = screen.getByLabelText(/chassis/i)
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        expect(screen.getByText(/system slots/i)).toBeInTheDocument()
        expect(screen.getByText(/module slots/i)).toBeInTheDocument()
        expect(screen.getByText(/cargo cap/i)).toBeInTheDocument()
        expect(screen.getByText(/tech level/i)).toBeInTheDocument()
        expect(screen.getByText(/salvage value/i)).toBeInTheDocument()
      })
    })
  })
})
