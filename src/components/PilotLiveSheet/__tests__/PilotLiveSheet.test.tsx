import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import { getCoreClasses, getStepperGroup, isStepperButtonDisabled } from '../../../test/helpers'

describe('PilotLiveSheet', () => {
  // Get real data from salvageunion-reference
  const coreClasses = getCoreClasses()

  beforeEach(() => {
    // No mocks needed - using real data
  })

  describe('Initial Render', () => {
    it('renders the pilot builder interface', () => {
      render(<PilotLiveSheet />)

      // Check for main sections by their content
      expect(screen.getByPlaceholderText(/enter callsign/i)).toBeInTheDocument()
      // Abilities and Inventory now appear as tabs (and section titles), so check for multiple
      expect(screen.getAllByText(/^abilities$/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/^inventory$/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/^notes$/i).length).toBeGreaterThan(0)
    })

    it('displays all main sections', () => {
      render(<PilotLiveSheet />)

      expect(screen.getByPlaceholderText(/enter callsign/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter motto/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter keepsake/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter background/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter appearance/i)).toBeInTheDocument()
    })

    it('shows class dropdown with core classes only', () => {
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      expect(classSelect).toBeInTheDocument()

      const options = classSelect.querySelectorAll('option')
      // Should have placeholder + core classes (not hybrid)
      expect(options.length).toBe(coreClasses.length + 1)
    })

    it('disables resource steppers when no class is selected', () => {
      render(<PilotLiveSheet />)

      // HP, AP, and TP stepper buttons should be disabled
      expect(isStepperButtonDisabled('HP', 'increment')).toBe(true)
      expect(isStepperButtonDisabled('HP', 'decrement')).toBe(true)
      expect(isStepperButtonDisabled('AP', 'increment')).toBe(true)
      expect(isStepperButtonDisabled('AP', 'decrement')).toBe(true)
      expect(isStepperButtonDisabled('TP', 'increment')).toBe(true)
      expect(isStepperButtonDisabled('TP', 'decrement')).toBe(true)
    })

    it('shows notes section', () => {
      render(<PilotLiveSheet />)

      expect(screen.getByText(/^notes$/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/add notes about your pilot/i)).toBeInTheDocument()
    })
  })

  describe('Class Selection', () => {
    it('enables resource steppers when class is selected', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, coreClasses[0].id)

      await waitFor(() => {
        // HP and AP start at max, so decrement buttons should be enabled
        expect(isStepperButtonDisabled('HP', 'decrement')).toBe(false)
        expect(isStepperButtonDisabled('AP', 'decrement')).toBe(false)
        expect(isStepperButtonDisabled('TP', 'increment')).toBe(false)
      })
    })

    it('initializes TP to 0 when class is selected', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, coreClasses[0].id)

      await waitFor(() => {
        // Check TP stepper shows 0
        const tpStepper = getStepperGroup('TP')
        expect(tpStepper).toBeInTheDocument()
        expect(within(tpStepper).getByText('0')).toBeInTheDocument()
      })
    })

    it('shows advanced class dropdown as disabled initially', () => {
      render(<PilotLiveSheet />)

      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      expect(advancedClassSelect).toBeDisabled()
    })
  })
})
