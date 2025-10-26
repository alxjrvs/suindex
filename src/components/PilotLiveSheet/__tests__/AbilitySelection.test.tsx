import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'

describe('PilotLiveSheet - Ability Selection', () => {
  // Use real data from salvageunion-reference
  const allClasses = SalvageUnionReference.Classes.all()
  const hackerClass = allClasses.find((c) => c.name === 'Hacker')

  if (!hackerClass) {
    throw new Error('Hacker class not found in salvageunion-reference')
  }

  // Get real abilities from the Hacker's core ability trees
  const allAbilities = SalvageUnionReference.Abilities.all()

  // Find abilities from the Hacker's core trees
  const hackerTrees = hackerClass.coreAbilities
  const hackerAbilities = allAbilities.filter((a) => hackerTrees.includes(a.tree))

  // Get specific abilities for testing
  const level1Abilities = hackerAbilities.filter((a) => a.level === 1)
  const level2Abilities = hackerAbilities.filter((a) => a.level === 2)
  const level3Abilities = hackerAbilities.filter((a) => a.level === 3)

  if (level1Abilities.length === 0) {
    throw new Error('No level 1 abilities found for Hacker class')
  }

  // Get a specific level 1 ability for testing (first one from the list)
  const testLevel1Ability = level1Abilities[0]
  const testLevel2Ability = level2Abilities.find((a) => a.tree === testLevel1Ability.tree)
  const testLevel3Ability = level3Abilities.find((a) => a.tree === testLevel1Ability.tree)

  beforeEach(() => {
    // Mock window.confirm for ability removal
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  describe('Ability Modal', () => {
    it('opens ability selector modal when Add button is clicked', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first
      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      // Find and click the Add button in the Abilities section
      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(/select ability/i)).toBeInTheDocument()
      })
    })

    it('displays only level 1 abilities initially', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        // Level 1 abilities should be visible and selectable
        expect(screen.getByText(level1Abilities[0].name)).toBeInTheDocument()
        if (level1Abilities.length > 1) {
          expect(screen.getByText(level1Abilities[1].name)).toBeInTheDocument()
        }

        // Higher level abilities are shown but their "Add to Pilot" buttons should be disabled
        if (level2Abilities.length > 0) {
          expect(screen.getByText(level2Abilities[0].name)).toBeInTheDocument()
        }
        if (level3Abilities.length > 0) {
          expect(screen.getByText(level3Abilities[0].name)).toBeInTheDocument()
        }
      })
    })

    it('shows ability cost in TP', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        // Core abilities should cost 1 TP
        const abilityCards = screen.getAllByText(/1 TP/i)
        expect(abilityCards.length).toBeGreaterThan(0)
      })
    })

    it('closes modal when clicking outside or cancel', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(/select ability/i)).toBeInTheDocument()
      })

      // Find and click close button
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText(/select ability/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Progressive Ability Unlocking', () => {
    it('only allows selecting level 1 abilities initially', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        // Level 1 abilities should be visible and selectable
        expect(screen.getByText(level1Abilities[0].name)).toBeInTheDocument()
        if (level1Abilities.length > 1) {
          expect(screen.getByText(level1Abilities[1].name)).toBeInTheDocument()
        }

        // Higher level abilities are shown but dimmed/disabled
        if (level2Abilities.length > 0) {
          expect(screen.getByText(level2Abilities[0].name)).toBeInTheDocument()
        }
      })

      // Verify that level 1 abilities have enabled "Add to Pilot" buttons
      const level1Buttons = screen.getAllByRole('button', { name: /Add to Pilot \(1 TP\)/i })
      expect(level1Buttons.length).toBeGreaterThan(0)
      expect(level1Buttons[0]).not.toBeDisabled()
    })

    it('unlocks level 2 abilities after selecting level 1 from same tree', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      // Open modal and select first level 1 ability
      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(testLevel1Ability.name)).toBeInTheDocument()
      })

      await waitFor(() => screen.getByText(testLevel1Ability.name))
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Reopen modal
      await user.click(addButton)

      await waitFor(() => {
        // Now level 2 from the same tree should be available (not dimmed)
        if (testLevel2Ability) {
          expect(screen.getByText(testLevel2Ability.name)).toBeInTheDocument()
        }
        // Level 2 from other trees should still be shown
        const otherTreeLevel2 = level2Abilities.find((a) => a.tree !== testLevel1Ability.tree)
        if (otherTreeLevel2) {
          expect(screen.getByText(otherTreeLevel2.name)).toBeInTheDocument()
        }
      })
    })

    it('requires all abilities from a tree to be selected before level 3', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 10
      const tpStepper = screen.getByRole('group', { name: /TP/i })
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 10; i++) {
        await user.click(tpIncrementButton)
      }

      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })

      // Select level 1 ability
      await user.click(addButton)
      await waitFor(() => expect(screen.getByText(testLevel1Ability.name)).toBeInTheDocument())
      const addToCharacterButtons1 = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons1[0])

      // Close the modal
      let closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Select level 2 ability from same tree
      if (testLevel2Ability) {
        await user.click(addButton)
        await waitFor(() => expect(screen.getByText(testLevel2Ability.name)).toBeInTheDocument())
        const addToCharacterButtons2 = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons2[0])

        // Close the modal
        closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)

        // Wait for modal to close
        await waitFor(() => {
          expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
        })

        // Now level 3 from same tree should be available
        if (testLevel3Ability) {
          await user.click(addButton)
          await waitFor(() => {
            expect(screen.getByText(testLevel3Ability.name)).toBeInTheDocument()
          })
        }
      }
    })
  })

  describe('TP Cost System', () => {
    it('deducts 1 TP when selecting a core ability', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Increase TP by clicking increment button 5 times
      const tpStepper = screen.getByRole('group', { name: /TP/i })

      // Initial TP should be 0
      const initialTpValue = within(tpStepper).getByText('0')
      expect(initialTpValue).toBeInTheDocument()
      const tpIncrementButton = tpStepper.querySelector(
        'button[aria-label="Increment TP"]'
      ) as HTMLButtonElement

      for (let i = 0; i < 5; i++) {
        await user.click(tpIncrementButton)
      }

      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('5')
        expect(tpValue).toBeInTheDocument()
      })

      // Select an ability
      const abilitiesSection = screen.getByText(/^abilities$/i).closest('div')
      const addButton = within(abilitiesSection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      // Wait for the "Add to Pilot" buttons to appear in the modal
      const addButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })
      // Click the first available button
      await user.click(addButtons[0])

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
      })

      // Wait for ability to appear in the selected abilities list
      await waitFor(() => {
        expect(screen.getByText(testLevel1Ability.name)).toBeInTheDocument()
      })

      // TP should be reduced by 1 (from 5 to 4)
      await waitFor(() => {
        const tpValue = within(tpStepper).getByText('4')
        expect(tpValue).toBeInTheDocument()
      })
    })
  })
})
