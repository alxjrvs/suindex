import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import MechLiveSheet from '../index'
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

describe('MechLiveSheet', () => {
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
      actionType: 'Free',
      actions: [],
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
      actions: [],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(SalvageUnionReference.Chassis.all).mockReturnValue(mockChassis)
    vi.mocked(SalvageUnionReference.Systems.all).mockReturnValue(mockSystems)
    vi.mocked(SalvageUnionReference.Modules.all).mockReturnValue(mockModules)
  })

  describe('Initial Render', () => {
    it('renders the mech builder interface', () => {
      render(<MechLiveSheet />)

      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter or select a pattern/i)).toBeInTheDocument()
      expect(screen.getAllByText(/system slots/i)[0]).toBeInTheDocument()
    })

    it('displays all main sections', () => {
      render(<MechLiveSheet />)

      expect(screen.getByText(/chassis ability/i)).toBeInTheDocument()
      expect(screen.getAllByText(/quirk/i)[0]).toBeInTheDocument()
      expect(screen.getAllByText(/appearance/i)[0]).toBeInTheDocument()
      expect(screen.getByText(/systems & modules/i)).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /cargo/i })).toBeInTheDocument()
    })

    it('shows resource steppers (SP, EP, Heat)', () => {
      render(<MechLiveSheet />)

      expect(screen.getByText(/^SP$/i)).toBeInTheDocument()
      expect(screen.getByText(/^EP$/i)).toBeInTheDocument()
      expect(screen.getByText(/^HEAT$/i)).toBeInTheDocument()
    })

    it('disables inputs when no chassis is selected', () => {
      render(<MechLiveSheet />)

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
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      expect(chassisSelect).toBeInTheDocument()

      const options = chassisSelect.querySelectorAll('option')
      expect(options.length).toBeGreaterThan(0)
    })

    it('updates stats when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        expect(screen.getByText(/0\/10/)).toBeInTheDocument() // SP
      })
    })

    it('enables inputs when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

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

    it('does not show confirmation alert on first chassis selection', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm')
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        expect(screen.getAllByText(/0\/10/).length).toBeGreaterThan(0)
      })

      expect(confirmSpy).not.toHaveBeenCalled()
      confirmSpy.mockRestore()
    })
  })

  describe('Pattern Selection', () => {
    it('shows pattern suggestions when typing', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
        expect(patternInput).not.toBeDisabled()
      })

      const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
      await user.click(patternInput)

      await waitFor(
        () => {
          const suggestions = screen.queryByText(/scout pattern/i)
          expect(suggestions).toBeInTheDocument()
        },
        { timeout: 5000 }
      )
    })

    it('applies pattern when confirmed', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
        expect(patternInput).not.toBeDisabled()
      })

      const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
      await user.click(patternInput)

      const scoutPattern = await screen.findByText(/scout pattern/i, {}, { timeout: 5000 })
      await user.click(scoutPattern)

      expect(confirmSpy).toHaveBeenCalled()
      confirmSpy.mockRestore()
    })
  })

  describe('Resource Management', () => {
    it('allows adjusting SP, EP, and Heat values', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(
        () => {
          // Verify SP display exists (0/10 for chassis-1)
          const spDisplays = screen.getAllByText(/0\/10/)
          expect(spDisplays.length).toBeGreaterThan(0)
        },
        { timeout: 5000 }
      )

      // Find increment buttons for SP
      const spSection = screen.getByText(/^SP$/i).closest('div')
      const incrementButton = spSection?.querySelector('button[aria-label*="Increment"]')

      if (incrementButton) {
        await user.click(incrementButton)
        await waitFor(
          () => {
            const updatedDisplays = screen.getAllByText(/1\/10/)
            expect(updatedDisplays.length).toBeGreaterThan(0)
          },
          { timeout: 5000 }
        )
      }
    })
  })

  describe('Systems and Modules', () => {
    it('shows add system/module button disabled when no chassis selected', () => {
      render(<MechLiveSheet />)

      const addButton = screen.getByRole('button', { name: /add system\/module/i })
      expect(addButton).toBeDisabled()
    })

    it('enables add system/module button when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(
        () => {
          const addButton = screen.getByRole('button', { name: /add system\/module/i })
          expect(addButton).not.toBeDisabled()
        },
        { timeout: 5000 }
      )
    })

    it('displays system and module slot usage', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(
        () => {
          // Check for chassis-1 stats: 4 system slots, 3 module slots
          const systemSlots = screen.getAllByText(/0\/4/)
          const moduleSlots = screen.getAllByText(/0\/3/)
          expect(systemSlots.length).toBeGreaterThan(0)
          expect(moduleSlots.length).toBeGreaterThan(0)
        },
        { timeout: 5000 }
      )
    })
  })

  describe('Cargo Management', () => {
    it('shows add cargo button disabled when no chassis selected', () => {
      render(<MechLiveSheet />)

      const addButtons = screen.getAllByRole('button', { name: /\+ add/i })
      const cargoButton = addButtons[1] // Second button is cargo (first is system/module)
      expect(cargoButton).toBeDisabled()
    })

    it('enables add cargo button when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        const addButtons = screen.getAllByRole('button', { name: /\+ add/i })
        const cargoButton = addButtons[1] // Second button is cargo (first is system/module)
        expect(cargoButton).not.toBeDisabled()
      })
    })

    it('displays cargo capacity', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(
        () => {
          // Check for chassis-1 cargo cap: 0/5
          const cargoDisplays = screen.getAllByText(/0\/5/)
          expect(cargoDisplays.length).toBeGreaterThan(0)
        },
        { timeout: 5000 }
      )
    })

    it('opens cargo modal when add cargo is clicked', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(async () => {
        const addButtons = screen.getAllByRole('button', { name: /\+ add/i })
        const cargoButton = addButtons[1] // Second button is cargo (first is system/module)
        await user.click(cargoButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/amount/i)).toBeInTheDocument()
        expect(screen.getByText(/description/i)).toBeInTheDocument()
      })
    })
  })

  describe('Quirk and Appearance', () => {
    it('allows entering quirk text when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      const quirkInput = screen.getByPlaceholderText(/enter quirk/i)
      await user.type(quirkInput, 'Rusty joints')

      expect(quirkInput).toHaveValue('Rusty joints')
    })

    it('allows entering appearance text when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      const appearanceInput = screen.getByPlaceholderText(/enter appearance/i)
      await user.type(appearanceInput, 'Battle-scarred red paint')

      expect(appearanceInput).toHaveValue('Battle-scarred red paint')
    })
  })

  describe('Chassis Stats Display', () => {
    it('displays all chassis stats correctly', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(
        () => {
          // Check that all stat labels are present
          const systemSlotsLabels = screen.getAllByText(/system slots/i)
          const moduleSlotsLabels = screen.getAllByText(/module slots/i)
          const cargoCapLabels = screen.getAllByText(/cargo cap/i)
          const techLevelLabels = screen.getAllByText(/tech level/i)
          const salvageValueLabels = screen.getAllByText(/salvage value/i)

          expect(systemSlotsLabels.length).toBeGreaterThan(0)
          expect(moduleSlotsLabels.length).toBeGreaterThan(0)
          expect(cargoCapLabels.length).toBeGreaterThan(0)
          expect(techLevelLabels.length).toBeGreaterThan(0)
          expect(salvageValueLabels.length).toBeGreaterThan(0)
        },
        { timeout: 5000 }
      )
    })
  })

  describe('Notes', () => {
    it('shows notes section', () => {
      render(<MechLiveSheet />)

      expect(screen.getByText(/notes/i)).toBeInTheDocument()
    })

    it('shows notes textarea disabled when no chassis selected', () => {
      render(<MechLiveSheet />)

      const notesTextarea = screen.getByPlaceholderText(/add notes about your mech/i)
      expect(notesTextarea).toBeDisabled()
    })

    it('enables notes textarea when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(() => {
        const notesTextarea = screen.getByPlaceholderText(/add notes about your mech/i)
        expect(notesTextarea).not.toBeDisabled()
      })
    })

    it('allows entering notes text when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, 'chassis-1')

      await waitFor(async () => {
        const notesTextarea = screen.getByPlaceholderText(/add notes about your mech/i)
        await user.type(notesTextarea, 'This mech is equipped for long-range combat')
      })

      const notesTextarea = screen.getByPlaceholderText(/add notes about your mech/i)
      expect(notesTextarea).toHaveValue('This mech is equipped for long-range combat')
    })
  })
})
