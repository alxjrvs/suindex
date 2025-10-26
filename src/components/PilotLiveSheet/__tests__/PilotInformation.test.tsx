import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'

describe('PilotLiveSheet - Pilot Information', () => {
  const allCoreClasses = SalvageUnionReference.CoreClasses.all()
  const hackerClass = allCoreClasses.find((c) => c.name === 'Hacker')

  if (!hackerClass) {
    throw new Error('Hacker class not found in salvageunion-reference')
  }

  describe('Input Fields', () => {
    it('shows callsign input field', () => {
      render(<PilotLiveSheet />)

      const callsignInput = screen.getByPlaceholderText(/enter callsign/i)
      expect(callsignInput).toBeInTheDocument()
    })

    it('shows motto input field', () => {
      render(<PilotLiveSheet />)

      const mottoInput = screen.getByPlaceholderText(/enter motto/i)
      expect(mottoInput).toBeInTheDocument()
    })

    it('shows keepsake input field', () => {
      render(<PilotLiveSheet />)

      const keepsakeInput = screen.getByPlaceholderText(/enter keepsake/i)
      expect(keepsakeInput).toBeInTheDocument()
    })

    it('shows background input field', () => {
      render(<PilotLiveSheet />)

      const backgroundInput = screen.getByPlaceholderText(/enter background/i)
      expect(backgroundInput).toBeInTheDocument()
    })

    it('shows appearance textarea', () => {
      render(<PilotLiveSheet />)

      const appearanceInput = screen.getByPlaceholderText(/enter appearance/i)
      expect(appearanceInput).toBeInTheDocument()
    })

    it('allows typing in callsign field', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const callsignInput = screen.getByPlaceholderText(/enter callsign/i)
      await user.type(callsignInput, 'Ghost')

      expect(callsignInput).toHaveValue('Ghost')
    })

    it('allows typing in motto field', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const mottoInput = screen.getByPlaceholderText(/enter motto/i)
      await user.type(mottoInput, 'Never give up')

      expect(mottoInput).toHaveValue('Never give up')
    })

    it('allows typing in keepsake field', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const keepsakeInput = screen.getByPlaceholderText(/enter keepsake/i)
      await user.type(keepsakeInput, 'Lucky coin')

      expect(keepsakeInput).toHaveValue('Lucky coin')
    })

    it('allows typing in background field', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const backgroundInput = screen.getByPlaceholderText(/enter background/i)
      await user.type(backgroundInput, 'Former soldier')

      expect(backgroundInput).toHaveValue('Former soldier')
    })

    it('allows typing in appearance textarea', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const appearanceInput = screen.getByPlaceholderText(/enter appearance/i)
      await user.type(appearanceInput, 'Tall with dark hair')

      expect(appearanceInput).toHaveValue('Tall with dark hair')
    })
  })

  describe('Used Checkboxes', () => {
    it('shows "Used" checkbox for motto', () => {
      render(<PilotLiveSheet />)

      const usedCheckbox = screen.getByRole('checkbox', { name: /motto/i })
      expect(usedCheckbox).toBeInTheDocument()
    })

    it('shows "Used" checkbox for keepsake', () => {
      render(<PilotLiveSheet />)

      const usedCheckbox = screen.getByRole('checkbox', { name: /keepsake/i })
      expect(usedCheckbox).toBeInTheDocument()
    })

    it('shows "Used" checkbox for background', () => {
      render(<PilotLiveSheet />)

      const usedCheckbox = screen.getByRole('checkbox', { name: /background/i })
      expect(usedCheckbox).toBeInTheDocument()
    })

    it('allows checking motto "Used" checkbox', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const usedCheckbox = screen.getByRole('checkbox', {
        name: /motto/i,
      }) as HTMLInputElement

      expect(usedCheckbox.checked).toBe(false)

      await user.click(usedCheckbox)

      expect(usedCheckbox.checked).toBe(true)
    })

    it('allows checking keepsake "Used" checkbox', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const usedCheckbox = screen.getByRole('checkbox', {
        name: /keepsake/i,
      }) as HTMLInputElement

      expect(usedCheckbox.checked).toBe(false)

      await user.click(usedCheckbox)

      expect(usedCheckbox.checked).toBe(true)
    })

    it('allows checking background "Used" checkbox', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const usedCheckbox = screen.getByRole('checkbox', {
        name: /background/i,
      }) as HTMLInputElement

      expect(usedCheckbox.checked).toBe(false)

      await user.click(usedCheckbox)

      expect(usedCheckbox.checked).toBe(true)
    })

    it('allows unchecking "Used" checkbox', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const usedCheckbox = screen.getByRole('checkbox', {
        name: /motto/i,
      }) as HTMLInputElement

      // Check it
      await user.click(usedCheckbox)
      expect(usedCheckbox.checked).toBe(true)

      // Uncheck it
      await user.click(usedCheckbox)
      expect(usedCheckbox.checked).toBe(false)
    })
  })

  describe('Notes Section', () => {
    it('shows notes textarea', () => {
      render(<PilotLiveSheet />)

      const notesTextarea = screen.getByPlaceholderText(/add notes about your pilot/i)
      expect(notesTextarea).toBeInTheDocument()
    })

    it('allows typing in notes textarea', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const notesTextarea = screen.getByPlaceholderText(/add notes about your pilot/i)
      await user.type(notesTextarea, 'This character is brave and loyal')

      expect(notesTextarea).toHaveValue('This character is brave and loyal')
    })

    it('allows multiline text in notes', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const notesTextarea = screen.getByPlaceholderText(/add notes about your pilot/i)
      await user.type(notesTextarea, 'Line 1{Enter}Line 2{Enter}Line 3')

      expect(notesTextarea).toHaveValue('Line 1\nLine 2\nLine 3')
    })
  })

  describe('Field Persistence', () => {
    it('retains callsign value when selecting a class', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const callsignInput = screen.getByPlaceholderText(/enter callsign/i)
      await user.type(callsignInput, 'Ghost')

      expect(callsignInput).toHaveValue('Ghost')
    })

    it('retains motto value when selecting a class', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const mottoInput = screen.getByPlaceholderText(/enter motto/i)
      await user.type(mottoInput, 'Never give up')

      expect(mottoInput).toHaveValue('Never give up')
    })

    it('retains appearance value when selecting a class', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const appearanceInput = screen.getByPlaceholderText(/enter appearance/i)
      await user.type(appearanceInput, 'Tall and strong')

      expect(appearanceInput).toHaveValue('Tall and strong')
    })
  })
})
