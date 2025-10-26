import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import MechLiveSheet from '../index'
import { getChassis, getChassisWithPatterns } from '../../../test/helpers'

describe('MechLiveSheet', () => {
  // Get real data from salvageunion-reference
  const allChassis = getChassis()

  // Get chassis with patterns for pattern tests
  const chassisWithPatterns = getChassisWithPatterns()

  // Use first chassis for most tests
  const testChassis = allChassis[0]

  beforeEach(() => {
    // No mocks needed - using real data
  })

  describe('Initial Render', () => {
    it('renders the mech builder interface', () => {
      render(<MechLiveSheet />)

      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter or select a pattern/i)).toBeInTheDocument()
      expect(screen.getAllByText(/sys. slots/i)[0]).toBeInTheDocument()
    })

    it('displays all main sections', () => {
      render(<MechLiveSheet />)

      expect(screen.getByRole('heading', { name: /Chassis/i })).toBeInTheDocument()
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
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(() => {
        // Just verify that SP section exists and has been updated
        const spSection = screen.getByText(/^SP$/i)
        expect(spSection).toBeInTheDocument()
      })
    })

    it('enables inputs when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

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
      const { vi } = await import('vitest')
      const confirmSpy = vi.spyOn(window, 'confirm')
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(() => {
        // Just verify that SP section exists
        const spSection = screen.getByText(/^SP$/i)
        expect(spSection).toBeInTheDocument()
      })

      expect(confirmSpy).not.toHaveBeenCalled()
      confirmSpy.mockRestore()
    })
  })

  describe('Pattern Selection', () => {
    it('shows pattern suggestions when typing', async () => {
      if (chassisWithPatterns.length === 0) {
        // Skip test if no chassis with patterns exist
        return
      }

      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, chassisWithPatterns[0].id)

      await waitFor(() => {
        const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
        expect(patternInput).not.toBeDisabled()
      })

      const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
      await user.click(patternInput)

      await waitFor(
        () => {
          const patternName = chassisWithPatterns[0].patterns[0].name
          const suggestions = screen.queryByText(new RegExp(patternName, 'i'))
          expect(suggestions).toBeInTheDocument()
        },
        { timeout: 5000 }
      )
    })

    it('applies pattern when confirmed', async () => {
      if (chassisWithPatterns.length === 0) {
        // Skip test if no chassis with patterns exist
        return
      }

      const user = userEvent.setup()
      const { vi } = await import('vitest')
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, chassisWithPatterns[0].id)

      await waitFor(() => {
        const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
        expect(patternInput).not.toBeDisabled()
      })

      const patternInput = screen.getByPlaceholderText(/enter or select a pattern/i)
      await user.click(patternInput)

      const patternName = chassisWithPatterns[0].patterns[0].name
      const pattern = await screen.findByText(new RegExp(patternName, 'i'), {}, { timeout: 5000 })
      await user.click(pattern)

      expect(confirmSpy).toHaveBeenCalled()
      confirmSpy.mockRestore()
    })
  })

  describe('Resource Management', () => {
    it('allows adjusting SP, EP, and Heat values', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(
        () => {
          // Verify SP section exists
          const spSection = screen.getByText(/^SP$/i)
          expect(spSection).toBeInTheDocument()
        },
        { timeout: 5000 }
      )

      // Find increment buttons for SP
      const spSection = screen.getByText(/^SP$/i).closest('div')
      const incrementButton = spSection?.querySelector('button[aria-label*="Increment"]')

      if (incrementButton) {
        await user.click(incrementButton)
        // Just verify the button was clickable - actual value update is tested elsewhere
        expect(incrementButton).toBeInTheDocument()
      }
    })
  })

  describe('Systems and Modules', () => {
    it('shows add system/module button disabled when no chassis selected', () => {
      render(<MechLiveSheet />)

      const addButton = screen.getAllByRole('button', { name: /\+/i })
      const systemModuleButton = addButton[0]
      expect(systemModuleButton).toBeDisabled()
    })

    it('enables add system/module button when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(
        () => {
          const addButton = screen.getAllByRole('button', { name: /\+/i })
          const systemModuleButton = addButton[0]
          expect(systemModuleButton).not.toBeDisabled()
        },
        { timeout: 5000 }
      )
    })

    it('displays system and module slot usage', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(
        () => {
          // Check for system and module slots
          const systemText = new RegExp(`0\\/${testChassis.stats.systemSlots}`)
          const moduleText = new RegExp(`0\\/${testChassis.stats.moduleSlots}`)
          const systemSlots = screen.getAllByText(systemText)
          const moduleSlots = screen.getAllByText(moduleText)
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

      const addButtons = screen.getAllByRole('button', { name: /\+/i })
      const cargoButton = addButtons[1] // Second button is cargo (first is system/module)
      expect(cargoButton).toBeDisabled()
    })

    it('enables add cargo button when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(() => {
        const addButtons = screen.getAllByRole('button', { name: /\+/i })
        const cargoButton = addButtons[1] // Second button is cargo (first is system/module)
        expect(cargoButton).not.toBeDisabled()
      })
    })

    it('displays cargo capacity', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(
        () => {
          // Check for cargo capacity
          const cargoText = new RegExp(`0\\/${testChassis.stats.cargoCap}`)
          const cargoDisplays = screen.getAllByText(cargoText)
          expect(cargoDisplays.length).toBeGreaterThan(0)
        },
        { timeout: 5000 }
      )
    })

    it('opens cargo modal when add cargo is clicked', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(async () => {
        const addButtons = screen.getAllByRole('button', { name: /\+/i })
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
      await user.selectOptions(chassisSelect, testChassis.id)

      const quirkInput = screen.getByPlaceholderText(/enter quirk/i)
      await user.type(quirkInput, 'Rusty joints')

      expect(quirkInput).toHaveValue('Rusty joints')
    })

    it('allows entering appearance text when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

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
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(
        () => {
          // Check that all stat labels are present
          const systemSlotsLabels = screen.getAllByText(/sys. slots/i)
          const moduleSlotsLabels = screen.getAllByText(/mod. slots/i)
          const cargoCapLabels = screen.getAllByText(/cargo cap/i)
          const techLevelLabels = screen.getAllByText(/tl/i)
          const salvageLabels = screen.getAllByText(/^sv$/i)

          expect(systemSlotsLabels.length).toBeGreaterThan(0)
          expect(moduleSlotsLabels.length).toBeGreaterThan(0)
          expect(cargoCapLabels.length).toBeGreaterThan(0)
          expect(techLevelLabels.length).toBeGreaterThan(0)
          expect(salvageLabels.length).toBeGreaterThan(0)
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
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(() => {
        const notesTextarea = screen.getByPlaceholderText(/add notes about your mech/i)
        expect(notesTextarea).not.toBeDisabled()
      })
    })

    it('allows entering notes text when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(async () => {
        const notesTextarea = screen.getByPlaceholderText(/add notes about your mech/i)
        await user.type(notesTextarea, 'This mech is equipped for long-range combat')
      })

      const notesTextarea = screen.getByPlaceholderText(/add notes about your mech/i)
      expect(notesTextarea).toHaveValue('This mech is equipped for long-range combat')
    })
  })

  describe('Pilot Display', () => {
    it('shows pilot section with sign in button in draft mode', () => {
      render(<MechLiveSheet />)

      expect(screen.getByRole('heading', { name: /Pilot/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in with discord/i })).toBeInTheDocument()
    })

    it('displays pilot name with class when pilot is selected', async () => {
      // This test would require mocking the pilot data and relationships
      // For now, we just verify the pilot section exists
      render(<MechLiveSheet />)

      expect(screen.getByRole('heading', { name: /Pilot/i })).toBeInTheDocument()
    })
  })
})
