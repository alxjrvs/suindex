import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'

describe('PilotLiveSheet', () => {
  // Get real data from salvageunion-reference
  const allClasses = SalvageUnionReference.Classes.all()

  // Find core classes for testing
  const coreClasses = allClasses.filter((c) => c.type === 'core')

  if (coreClasses.length === 0) {
    throw new Error('No core classes found in salvageunion-reference')
  }

  beforeEach(() => {
    // No mocks needed - using real data
  })

  describe('Initial Render', () => {
    it('renders the pilot builder interface', () => {
      render(<PilotLiveSheet />)

      // Check for main sections by their content
      expect(screen.getByPlaceholderText(/enter callsign/i)).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /abilities/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /inventory/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /notes/i })).toBeInTheDocument()
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
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, coreClasses[0].id)

      await waitFor(() => {
        // Check TP stepper shows 0
        const tpStepper = screen.getByRole('group', { name: /TP/i })
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
