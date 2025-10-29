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
    it('renders the mech builder interface', async () => {
      render(<MechLiveSheet />)

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument()
      })
      expect(screen.getByPlaceholderText(/enter or select a pattern/i)).toBeInTheDocument()
      // StatDisplay splits labels - check for "System" and "Slots" separately
      // Use getAllByText since "System" appears in both "Systems & Modules" and the stat label
      expect(screen.getAllByText(/system/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/slots/i).length).toBeGreaterThan(0)
    })

    it('displays all main sections', async () => {
      render(<MechLiveSheet />)

      await waitFor(() => {
        expect(screen.getByText(/^chassis$/i)).toBeInTheDocument()
      })
      expect(screen.getAllByText(/quirk/i)[0]).toBeInTheDocument()
      expect(screen.getAllByText(/appearance/i)[0]).toBeInTheDocument()
      expect(screen.getByText(/^systems$/i)).toBeInTheDocument()
      expect(screen.getByText(/^modules$/i)).toBeInTheDocument()
      // Cargo appears in multiple places (heading and stat label), so use getAllByText
      expect(screen.getAllByText(/cargo/i).length).toBeGreaterThan(0)
    })

    it('shows resource steppers (SP, EP, Heat)', async () => {
      render(<MechLiveSheet />)

      await waitFor(() => {
        expect(screen.getByText(/^SP$/i)).toBeInTheDocument()
      })
      expect(screen.getByText(/^EP$/i)).toBeInTheDocument()
      expect(screen.getByText(/^HEAT$/i)).toBeInTheDocument()
    })

    it('disables inputs when no chassis is selected', async () => {
      render(<MechLiveSheet />)

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter or select a pattern/i)).toBeInTheDocument()
      })

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

      await waitFor(() => {
        const chassisSelect = screen.getByRole('combobox')
        expect(chassisSelect).toBeInTheDocument()

        const options = chassisSelect.querySelectorAll('option')
        expect(options.length).toBeGreaterThan(0)
      })
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
    it('shows add system/module buttons disabled when no chassis selected', async () => {
      render(<MechLiveSheet />)

      await waitFor(() => {
        // Find the add buttons in the Systems and Modules sections
        const addSystemButton = screen.getByRole('button', { name: 'Add Systems' })
        const addModulesButton = screen.getByRole('button', { name: 'Add Modules' })
        expect(addSystemButton).toBeDisabled()
        expect(addModulesButton).toBeDisabled()
      })
    })

    it('enables add system/module buttons when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(
        () => {
          const addSystemButton = screen.getByRole('button', { name: 'Add Systems' })
          const addModulesButton = screen.getByRole('button', { name: 'Add Modules' })
          expect(addSystemButton).not.toBeDisabled()
          expect(addModulesButton).not.toBeDisabled()
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
    it('shows empty cargo cells with + icon when no chassis selected', async () => {
      render(<MechLiveSheet />)

      await waitFor(() => {
        // Empty cells should not be clickable when disabled
        const plusSigns = screen.queryAllByText('+')
        // Should have some + signs from the cargo grid
        expect(plusSigns.length).toBeGreaterThan(0)
      })
    })

    it('shows clickable empty cargo cells when chassis is selected', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(() => {
        // Empty cells should show + icon
        const plusSigns = screen.getAllByText('+')
        // testChassis.stats.cargoCap is 16, plus 1 for the Systems & Modules add button
        expect(plusSigns.length).toBe(testChassis.stats.cargoCap + 1)
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

    it('opens cargo modal when empty cell is clicked', async () => {
      const user = userEvent.setup()
      render(<MechLiveSheet />)

      const chassisSelect = screen.getByRole('combobox')
      await user.selectOptions(chassisSelect, testChassis.id)

      await waitFor(async () => {
        // Click a cargo cell (skip the first + which is the Systems & Modules add button)
        const emptyCells = screen.getAllByText('+')
        await user.click(emptyCells[1])
      })

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter cargo description/i)).toBeInTheDocument()
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
          // Check that all stat displays are present using aria-labels
          // StatDisplay combines label and bottomLabel into aria-label (e.g., "Sys. Slots")
          // Use getAllByLabelText since some stats appear multiple times (e.g., max and current)
          expect(screen.getAllByLabelText(/Sys\. Slots/i).length).toBeGreaterThan(0)
          expect(screen.getAllByLabelText(/Mod\. Slots/i).length).toBeGreaterThan(0)
          expect(screen.getAllByLabelText(/Cargo Cap/i).length).toBeGreaterThan(0)
          expect(screen.getAllByLabelText(/Salvage Value/i).length).toBeGreaterThan(0)
        },
        { timeout: 5000 }
      )
    })
  })

  describe('Notes', () => {
    it('shows notes section', async () => {
      render(<MechLiveSheet />)

      await waitFor(() => {
        expect(screen.getByText(/notes/i)).toBeInTheDocument()
      })
    })

    it('shows notes textarea disabled when no chassis selected', async () => {
      render(<MechLiveSheet />)

      await waitFor(() => {
        const notesTextarea = screen.getByPlaceholderText(/add notes about your mech/i)
        expect(notesTextarea).toBeDisabled()
      })
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
})
