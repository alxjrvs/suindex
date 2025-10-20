import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

describe('CharacterBuilder - Resource Management', () => {
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
  const mockEquipment: Equipment[] = []

  beforeEach(() => {
    vi.mocked(SalvageUnionReference.Classes.all).mockReturnValue(mockClasses)
    vi.mocked(SalvageUnionReference.Abilities.all).mockReturnValue(mockAbilities)
    vi.mocked(SalvageUnionReference.Equipment.all).mockReturnValue(mockEquipment)
    vi.mocked(SalvageUnionReference.AbilityTreeRequirements.all).mockReturnValue([])
  })

  describe('HP (Hit Points)', () => {
    it('shows HP stepper', () => {
      render(<CharacterBuilder />)

      const hpLabel = screen.getByText(/HP/i)
      expect(hpLabel).toBeInTheDocument()
    })

    it('initializes HP to 10/10', () => {
      render(<CharacterBuilder />)

      expect(screen.getByText(/10\/10/)).toBeInTheDocument()
    })

    it('disables HP stepper when no class is selected', () => {
      render(<CharacterBuilder />)

      const hpStepper = screen.getByLabelText(/HP/i)
      expect(hpStepper).toBeDisabled()
    })

    it('enables HP stepper when class is selected', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const hpStepper = screen.getByLabelText(/HP/i)
        expect(hpStepper).not.toBeDisabled()
      })
    })

    it('allows adjusting current HP', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const hpStepper = screen.getByLabelText(/HP/i)
        expect(hpStepper).not.toBeDisabled()
      })

      const hpStepper = screen.getByLabelText(/HP/i)
      await user.clear(hpStepper)
      await user.type(hpStepper, '7')

      await waitFor(() => {
        expect(screen.getByText(/7\/10/)).toBeInTheDocument()
      })
    })

    it('allows adjusting max HP', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const maxHpStepper = screen.getByLabelText(/max HP/i)
        expect(maxHpStepper).not.toBeDisabled()
      })

      const maxHpStepper = screen.getByLabelText(/max HP/i)
      await user.clear(maxHpStepper)
      await user.type(maxHpStepper, '15')

      await waitFor(() => {
        expect(screen.getByText(/10\/15/)).toBeInTheDocument()
      })
    })
  })

  describe('AP (Action Points)', () => {
    it('shows AP stepper', () => {
      render(<CharacterBuilder />)

      const apLabel = screen.getByText(/^AP$/i)
      expect(apLabel).toBeInTheDocument()
    })

    it('initializes AP to 5/5', () => {
      render(<CharacterBuilder />)

      expect(screen.getByText(/5\/5/)).toBeInTheDocument()
    })

    it('disables AP stepper when no class is selected', () => {
      render(<CharacterBuilder />)

      const apStepper = screen.getByLabelText(/^AP$/i)
      expect(apStepper).toBeDisabled()
    })

    it('enables AP stepper when class is selected', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const apStepper = screen.getByLabelText(/^AP$/i)
        expect(apStepper).not.toBeDisabled()
      })
    })

    it('allows adjusting current AP', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const apStepper = screen.getByLabelText(/^AP$/i)
        expect(apStepper).not.toBeDisabled()
      })

      const apStepper = screen.getByLabelText(/^AP$/i)
      await user.clear(apStepper)
      await user.type(apStepper, '3')

      await waitFor(() => {
        expect(screen.getByText(/3\/5/)).toBeInTheDocument()
      })
    })

    it('allows adjusting max AP', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const maxApStepper = screen.getByLabelText(/max AP/i)
        expect(maxApStepper).not.toBeDisabled()
      })

      const maxApStepper = screen.getByLabelText(/max AP/i)
      await user.clear(maxApStepper)
      await user.type(maxApStepper, '7')

      await waitFor(() => {
        expect(screen.getByText(/5\/7/)).toBeInTheDocument()
      })
    })
  })

  describe('TP (Training Points)', () => {
    it('shows TP display', () => {
      render(<CharacterBuilder />)

      expect(screen.getByText(/0 TP/i)).toBeInTheDocument()
    })

    it('initializes TP to 0', () => {
      render(<CharacterBuilder />)

      expect(screen.getByText(/0 TP/i)).toBeInTheDocument()
    })

    it('disables TP stepper when no class is selected', () => {
      render(<CharacterBuilder />)

      const tpStepper = screen.getByLabelText(/TP/i)
      expect(tpStepper).toBeDisabled()
    })

    it('enables TP stepper when class is selected', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const tpStepper = screen.getByLabelText(/TP/i)
        expect(tpStepper).not.toBeDisabled()
      })
    })

    it('allows adjusting TP', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const tpStepper = screen.getByLabelText(/TP/i)
        expect(tpStepper).not.toBeDisabled()
      })

      const tpStepper = screen.getByLabelText(/TP/i)
      await user.clear(tpStepper)
      await user.type(tpStepper, '10')

      await waitFor(() => {
        expect(screen.getByText(/10 TP/i)).toBeInTheDocument()
      })
    })

    it('shows TP as single value (not current/max format)', () => {
      render(<CharacterBuilder />)

      // Should show "TP" label and "0" value (not "0/X" format)
      expect(screen.getByText('TP')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
      // Should not have slash format like "0/10"
      expect(screen.queryByText(/0\/\d+/)).not.toBeInTheDocument()
    })
  })

  describe('Resource Stepper Behavior', () => {
    it('prevents negative values in HP', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const hpStepper = screen.getByLabelText(/HP/i)
        expect(hpStepper).not.toBeDisabled()
      })

      const hpStepper = screen.getByLabelText(/HP/i) as HTMLInputElement
      await user.clear(hpStepper)
      await user.type(hpStepper, '-5')

      // Should not allow negative value or should clamp to 0
      expect(parseInt(hpStepper.value)).toBeGreaterThanOrEqual(0)
    })

    it('prevents negative values in AP', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const apStepper = screen.getByLabelText(/^AP$/i)
        expect(apStepper).not.toBeDisabled()
      })

      const apStepper = screen.getByLabelText(/^AP$/i) as HTMLInputElement
      await user.clear(apStepper)
      await user.type(apStepper, '-3')

      // Should not allow negative value or should clamp to 0
      expect(parseInt(apStepper.value)).toBeGreaterThanOrEqual(0)
    })

    it('prevents negative values in TP', async () => {
      const user = userEvent.setup()
      render(<CharacterBuilder />)

      const classSelect = screen.getByRole('combobox', { name: /^class$/i })
      await user.selectOptions(classSelect, 'class-hacker')

      await waitFor(() => {
        const tpStepper = screen.getByLabelText(/TP/i)
        expect(tpStepper).not.toBeDisabled()
      })

      const tpStepper = screen.getByLabelText(/TP/i) as HTMLInputElement
      await user.clear(tpStepper)
      await user.type(tpStepper, '-10')

      // Should not allow negative value or should clamp to 0
      expect(parseInt(tpStepper.value)).toBeGreaterThanOrEqual(0)
    })
  })
})
