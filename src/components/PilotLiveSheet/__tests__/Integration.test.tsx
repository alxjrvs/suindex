import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import {
  findCoreClass,
  findHybridClass,
  getEquipment,
  expandAllAbilities,
} from '../../../test/helpers'

describe('PilotLiveSheet - Integration Tests', () => {
  // Get real data from salvageunion-reference
  const hackerClass = findCoreClass('Hacker')
  const fabricatorClass = findHybridClass('Fabricator') // Hybrid class
  const allEquipment = getEquipment()

  const testEquipment = allEquipment.slice(0, 2) // Get first 2 equipment items for testing

  beforeEach(() => {
    // Mock window.confirm to always return true
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  describe('Complete Pilot Creation Flow', () => {
    it('creates a complete character from start to finish', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Step 1: Select class first to enable inputs
      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Step 2: Fill in pilot information
      await user.type(screen.getByPlaceholderText(/enter callsign/i), 'Ghost')
      await user.type(screen.getByPlaceholderText(/enter motto/i), 'Never give up')
      await user.type(screen.getByPlaceholderText(/enter keepsake/i), 'Lucky coin')
      await user.type(screen.getByPlaceholderText(/enter background/i), 'Former soldier')
      await user.type(screen.getByPlaceholderText(/enter appearance/i), 'Tall with dark hair')

      // Step 3: Set resources
      await waitFor(() => {
        const tpStepper = screen.getByRole('group', { name: /TP/i })
        const tpIncrementButton = tpStepper.querySelector('button[aria-label="Increment TP"]')
        expect(tpIncrementButton).not.toBeDisabled()
      })

      // Increase TP to 20 by clicking increment button
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 20; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Step 4: Select 6 core abilities - abilities are now shown inline
      for (let i = 0; i < 6; i++) {
        // Wait for the "Add to Pilot" buttons to appear
        const addButtons = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        // Click the first available button
        await user.click(addButtons[0])
      }

      // Step 5: Select advanced class
      await waitFor(() => {
        const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
        expect(advancedClassSelect).not.toBeDisabled()
      })

      const advancedClassSelect = screen.getAllByRole('combobox')[1] // Second combobox is Advanced Class
      await user.selectOptions(advancedClassSelect, fabricatorClass.id)

      // Step 6: Select hybrid class ability - abilities are now shown inline
      // Give React time to render the advanced abilities, then expand them
      await new Promise((resolve) => setTimeout(resolve, 100))
      await expandAllAbilities(user)

      // Click the first "Add to Pilot" button for a hybrid ability (advanced ability costs 2 TP)
      const hybridAddButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(2 TP\)/i,
      })
      await user.click(hybridAddButtons[0])

      // Step 7: Add equipment
      const addEquipmentButton = screen.getByRole('button', { name: /add equipment/i })

      await user.click(addEquipmentButton)
      // Wait for the equipment selector modal to open and find the first equipment button
      const equipment1Button = await screen.findByRole('button', {
        name: new RegExp(testEquipment[0].name, 'i'),
      })
      await user.click(equipment1Button)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      await user.click(addEquipmentButton)
      const equipment2Button = await screen.findByRole('button', {
        name: new RegExp(testEquipment[1].name, 'i'),
      })
      await user.click(equipment2Button)

      // Step 8: Add notes
      await user.type(
        screen.getByPlaceholderText(/add notes about your pilot/i),
        'A skilled hacker with fabrication abilities'
      )

      // Verify final state
      await waitFor(() => {
        // Pilot info
        expect(screen.getByPlaceholderText(/enter callsign/i)).toHaveValue('Ghost')
        expect(screen.getByPlaceholderText(/enter motto/i)).toHaveValue('Never give up')

        // Equipment - check that equipment was added (count should be 2/6)
        expect(screen.getByText(/2\/6/)).toBeInTheDocument()

        // TP (20 - 6 core - 2 hybrid = 12) - find the TP stepper and check its value
        const tpStepper = screen.getByLabelText('Increment TP').closest('div')!.parentElement!
        expect(within(tpStepper).getByText('12')).toBeInTheDocument()

        // Notes
        expect(screen.getByPlaceholderText(/add notes about your pilot/i)).toHaveValue(
          'A skilled hacker with fabrication abilities'
        )
      })
    })

    it('handles ability selection with insufficient TP', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to only 1
      await waitFor(() => {
        const tpStepper = screen.getByRole('group', { name: /TP/i })
        const tpIncrementButton = tpStepper.querySelector(
          'button[aria-label="Increment TP"]'
        ) as HTMLButtonElement
        expect(tpIncrementButton).not.toBeDisabled()
      })

      // Increase TP to 1 by clicking increment button once
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement
      await user.click(tpIncrementButton)

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Select first ability (costs 1 TP) - abilities are now shown inline
      // Wait for the "Add to Pilot" buttons to appear
      const addButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })
      await user.click(addButtons[0])

      // TP should now be 0
      await waitFor(() => {
        const tpStepper = screen.getByLabelText('Increment TP').closest('div')!.parentElement!
        expect(within(tpStepper).getByText('0')).toBeInTheDocument()
      })

      // All "Add to Pilot" buttons should be disabled since TP is 0
      await waitFor(() => {
        const addToCharacterButtons = screen.queryAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        addToCharacterButtons.forEach((button) => {
          expect(button).toBeDisabled()
        })
      })
    })
  })

  describe('State Consistency', () => {
    it('maintains consistent state when changing classes', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select first class and add abilities
      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Increase TP to 10 by clicking increment button
      const tpIncrementButton = screen.getByLabelText('Increment TP')

      for (let i = 0; i < 10; i++) {
        await user.click(tpIncrementButton)
      }

      // Expand all abilities to see the "Add to Pilot" buttons
      await expandAllAbilities(user)

      // Abilities are now shown inline - select one
      const addButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })
      await user.click(addButtons[0])

      // Change class - should reset abilities
      await user.selectOptions(classSelect, '')
      await user.selectOptions(classSelect, hackerClass.id)

      // Abilities should be cleared after changing class
      await waitFor(() => {
        // Check that abilities section shows 0 abilities
        expect(screen.queryByRole('button', { name: /remove ability/i })).not.toBeInTheDocument()
      })
    })
  })
})
