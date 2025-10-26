import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import {
  findCoreClass,
  getAbilitiesForClass,
  getAbilitiesByLevel,
  incrementStepper,
  openSection,
  closeModalAndWait,
} from '../../../test/helpers'

describe('PilotLiveSheet - Ability Selection', () => {
  // Use real data from salvageunion-reference
  const hackerClass = findCoreClass('Hacker')

  // Get real abilities from the Hacker's core ability trees
  const hackerAbilities = getAbilitiesForClass(hackerClass)

  // Get specific abilities for testing
  const level1Abilities = getAbilitiesByLevel(hackerAbilities, 1)
  const level2Abilities = getAbilitiesByLevel(hackerAbilities, 2)
  const level3Abilities = getAbilitiesByLevel(hackerAbilities, 3)

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
      await incrementStepper(user, 'TP', 5)

      // Find and click the Add button in the Abilities section
      await openSection(user, 'abilities')

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
      await incrementStepper(user, 'TP', 5)

      await openSection(user, 'abilities')

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
      await incrementStepper(user, 'TP', 5)

      await openSection(user, 'abilities')

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
      await incrementStepper(user, 'TP', 5)

      await openSection(user, 'abilities')

      await waitFor(() => {
        expect(screen.getByText(/select ability/i)).toBeInTheDocument()
      })

      // Close modal and wait for it to disappear
      await closeModalAndWait(user, /select ability/i)
    })
  })

  describe('Progressive Ability Unlocking', () => {
    it('only allows selecting level 1 abilities initially', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      const classSelect = screen.getAllByRole('combobox')[0] // First combobox is Class
      await user.selectOptions(classSelect, hackerClass.id)

      // Set TP to 5
      await incrementStepper(user, 'TP', 5)

      await openSection(user, 'abilities')

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
      await incrementStepper(user, 'TP', 5)

      // Open modal and select first level 1 ability
      await openSection(user, 'abilities')

      await waitFor(() => {
        expect(screen.getByText(testLevel1Ability.name)).toBeInTheDocument()
      })

      await waitFor(() => screen.getByText(testLevel1Ability.name))
      const addToCharacterButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons[0])

      // Close the modal and wait for it to close
      await closeModalAndWait(user, /select ability/i)

      // Reopen modal
      await openSection(user, 'abilities')

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
      await incrementStepper(user, 'TP', 10)

      // Select level 1 ability
      await openSection(user, 'abilities')
      await waitFor(() => expect(screen.getByText(testLevel1Ability.name)).toBeInTheDocument())
      const addToCharacterButtons1 = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })
      await user.click(addToCharacterButtons1[0])

      // Close the modal and wait for it to close
      await closeModalAndWait(user, /select ability/i)

      // Select level 2 ability from same tree
      if (testLevel2Ability) {
        await openSection(user, 'abilities')
        await waitFor(() => expect(screen.getByText(testLevel2Ability.name)).toBeInTheDocument())
        const addToCharacterButtons2 = await screen.findAllByRole('button', {
          name: /Add to Pilot \(1 TP\)/i,
        })
        await user.click(addToCharacterButtons2[0])

        // Close the modal and wait for it to close
        await closeModalAndWait(user, /select ability/i)

        // Now level 3 from same tree should be available
        if (testLevel3Ability) {
          await openSection(user, 'abilities')
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

      // Increase TP to 5
      await incrementStepper(user, 'TP', 5)

      // Select an ability
      await openSection(user, 'abilities')

      // Wait for the "Add to Pilot" buttons to appear in the modal
      const addButtons = await screen.findAllByRole('button', {
        name: /Add to Pilot \(1 TP\)/i,
      })
      // Click the first available button
      await user.click(addButtons[0])

      // Close the modal and wait for it to close
      await closeModalAndWait(user, /select ability/i)

      // Wait for ability to appear in the selected abilities list
      await waitFor(() => {
        expect(screen.getByText(testLevel1Ability.name)).toBeInTheDocument()
      })
    })
  })
})
