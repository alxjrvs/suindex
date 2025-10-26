import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import { findCoreClass } from '../../../test/helpers'

describe('PilotLiveSheet - Resource Management', () => {
  // Use real data from salvageunion-reference
  const hackerClass = findCoreClass('Hacker')

  describe('HP (Hit Points)', () => {
    it('shows HP stepper', () => {
      render(<PilotLiveSheet />)

      const hpLabel = screen.getByText(/HP/i)
      expect(hpLabel).toBeInTheDocument()
    })

    it('initializes HP to 10/10', () => {
      render(<PilotLiveSheet />)

      expect(screen.getByText(/10\/10/)).toBeInTheDocument()
    })

    it('disables HP stepper when no class is selected', () => {
      render(<PilotLiveSheet />)

      const hpStepper = screen.getByRole('group', { name: /HP/i })
      const incrementButton = hpStepper.querySelector('button[aria-label="Increment HP"]')
      expect(incrementButton).toBeDisabled()
    })

    it('enables HP stepper when class is selected', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      await waitFor(() => {
        const hpStepper = screen.getByRole('group', { name: /HP/i })
        // HP starts at 10/10, so decrement should be enabled
        const decrementButton = hpStepper.querySelector('button[aria-label="Decrement HP"]')
        expect(decrementButton).not.toBeDisabled()
      })
    })

    it('allows adjusting current HP', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      await waitFor(() => {
        const hpStepper = screen.getByRole('group', { name: /HP/i })
        // HP starts at 10/10, so decrement should be enabled
        const decrementButton = hpStepper.querySelector('button[aria-label="Decrement HP"]')
        expect(decrementButton).not.toBeDisabled()
      })

      // Decrement HP from 10 to 7 (3 clicks)
      const hpStepper = screen.getByRole('group', { name: /HP/i })
      const decrementButton = hpStepper.querySelector(
        'button[aria-label="Decrement HP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 3; i++) {
        await user.click(decrementButton)
      }

      await waitFor(() => {
        expect(screen.getByText(/7\/10/)).toBeInTheDocument()
      })
    })
  })

  describe('AP (Action Points)', () => {
    it('shows AP stepper', () => {
      render(<PilotLiveSheet />)

      const apLabel = screen.getByText(/^AP$/i)
      expect(apLabel).toBeInTheDocument()
    })

    it('initializes AP to 5/5', () => {
      render(<PilotLiveSheet />)

      expect(screen.getByText(/5\/5/)).toBeInTheDocument()
    })

    it('disables AP stepper when no class is selected', () => {
      render(<PilotLiveSheet />)

      const apStepper = screen.getByRole('group', { name: /^AP$/i })
      const incrementButton = apStepper.querySelector('button[aria-label="Increment AP"]')
      expect(incrementButton).toBeDisabled()
    })

    it('enables AP stepper when class is selected', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      await waitFor(() => {
        const apStepper = screen.getByRole('group', { name: /^AP$/i })
        // AP starts at 5/5, so decrement should be enabled
        const decrementButton = apStepper.querySelector('button[aria-label="Decrement AP"]')
        expect(decrementButton).not.toBeDisabled()
      })
    })

    it('allows adjusting current AP', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      await waitFor(() => {
        const apStepper = screen.getByRole('group', { name: /^AP$/i })
        // AP starts at 5/5, so decrement should be enabled
        const decrementButton = apStepper.querySelector('button[aria-label="Decrement AP"]')
        expect(decrementButton).not.toBeDisabled()
      })

      // Decrement AP from 5 to 3 (2 clicks)
      const apStepper = screen.getByRole('group', { name: /^AP$/i })
      const decrementButton = apStepper.querySelector(
        'button[aria-label="Decrement AP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 2; i++) {
        await user.click(decrementButton)
      }

      await waitFor(() => {
        expect(screen.getByText(/3\/5/)).toBeInTheDocument()
      })
    })
  })

  describe('TP (Training Points)', () => {
    it('shows TP display', () => {
      render(<PilotLiveSheet />)

      const tpLabels = screen.getAllByText('TP')
      expect(tpLabels.length).toBeGreaterThan(0)
      const zeros = screen.getAllByText('0')
      expect(zeros.length).toBeGreaterThan(0)
    })

    it('initializes TP to 0', () => {
      render(<PilotLiveSheet />)

      const tpLabels = screen.getAllByText('TP')
      expect(tpLabels.length).toBeGreaterThan(0)
      const zeros = screen.getAllByText('0')
      expect(zeros.length).toBeGreaterThan(0)
    })

    it('disables TP stepper when no class is selected', () => {
      render(<PilotLiveSheet />)

      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const incrementButton = tpStepper.querySelector('button[aria-label="Increment TP"]')
      expect(incrementButton).toBeDisabled()
    })

    it('enables TP stepper when class is selected', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      await waitFor(() => {
        const tpStepper = screen.getByRole('group', { name: /TP/i })
        const incrementButton = tpStepper.querySelector('button[aria-label="Increment TP"]')
        expect(incrementButton).not.toBeDisabled()
      })
    })

    it('allows adjusting TP', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      await waitFor(() => {
        const tpStepper = screen.getByRole('group', { name: /TP/i })
        const incrementButton = tpStepper.querySelector('button[aria-label="Increment TP"]')
        expect(incrementButton).not.toBeDisabled()
      })

      // Increment TP from 0 to 10 (10 clicks)
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const incrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 10; i++) {
        await user.click(incrementButton)
      }

      await waitFor(() => {
        const tens = screen.getAllByText('10')
        expect(tens.length).toBeGreaterThan(0)
      })
    })

    it('shows TP as single value (not current/max format)', () => {
      render(<PilotLiveSheet />)

      // Should show "TP" label and "0" value (not "0/X" format)
      const tpLabels = screen.getAllByText('TP')
      expect(tpLabels.length).toBeGreaterThan(0)
      const zeros = screen.getAllByText('0')
      expect(zeros.length).toBeGreaterThan(0)
      // TP stepper should show just the value, not value/max format
      // HP shows "10/10" and AP shows "5/5", but TP should just show "0"
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      expect(tpStepper.textContent).toContain('TP')
      expect(tpStepper.textContent).toContain('0')
      expect(tpStepper.textContent).not.toMatch(/\d+\/\d+/)
    })
  })

  describe('Resource Stepper Behavior', () => {
    it('prevents negative values in HP', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Decrement HP to 0
      const hpStepper = screen.getByRole('group', { name: /HP/i })
      const decrementButton = hpStepper.querySelector(
        'button[aria-label="Decrement HP"]'
      ) as HTMLButtonElement

      // Click decrement 10 times to get to 0
      for (let i = 0; i < 10; i++) {
        await user.click(decrementButton)
      }

      // Verify we're at 0
      await waitFor(() => {
        expect(screen.getByText(/0\/10/)).toBeInTheDocument()
      })

      // Decrement button should now be disabled
      expect(decrementButton).toBeDisabled()
    })

    it('prevents negative values in AP', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Decrement AP to 0
      const apStepper = screen.getByRole('group', { name: /^AP$/i })
      const decrementButton = apStepper.querySelector(
        'button[aria-label="Decrement AP"]'
      ) as HTMLButtonElement

      // Click decrement 5 times to get to 0
      for (let i = 0; i < 5; i++) {
        await user.click(decrementButton)
      }

      // Verify we're at 0
      await waitFor(() => {
        expect(screen.getByText(/0\/5/)).toBeInTheDocument()
      })

      // Decrement button should now be disabled
      expect(decrementButton).toBeDisabled()
    })

    it('prevents negative values in TP', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // TP starts at 0, so decrement button should already be disabled
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const decrementButton = tpStepper.querySelector(
        'button[aria-label="Decrement TP"]'
      ) as HTMLButtonElement

      // Decrement button should be disabled at 0
      expect(decrementButton).toBeDisabled()
    })
  })
})
