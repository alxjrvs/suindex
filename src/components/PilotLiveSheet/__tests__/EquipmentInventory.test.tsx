import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import PilotLiveSheet from '../index'
import { findCoreClass, getEquipment } from '../../../test/helpers'

describe('PilotLiveSheet - Equipment Inventory', () => {
  // Use real data from salvageunion-reference
  const hackerClass = findCoreClass('Hacker')

  // Get real equipment
  const allEquipment = getEquipment()
  const testEquipment = allEquipment.slice(0, 3) // Get first 3 equipment items for testing

  beforeEach(() => {
    // Mock window.confirm for equipment removal
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  describe('Inventory Display', () => {
    it('shows inventory section', () => {
      render(<PilotLiveSheet />)

      expect(screen.getByText(/^inventory$/i)).toBeInTheDocument()
    })

    it('shows equipment count as 0/6 initially', () => {
      render(<PilotLiveSheet />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      expect(within(inventorySection!).getByText(/0\/6/)).toBeInTheDocument()
    })

    it('shows Add button for equipment', () => {
      render(<PilotLiveSheet />)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })
      expect(addButton).toBeInTheDocument()
    })

    it('does not show empty slot placeholders', () => {
      render(<PilotLiveSheet />)

      // Should not show dashed boxes or "—" symbols for empty slots
      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const emptySlots = within(inventorySection!).queryAllByText('—')
      expect(emptySlots.length).toBe(0)
    })
  })

  describe('Adding Equipment', () => {
    it('opens equipment selector modal when Add button is clicked', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(/add equipment/i)).toBeInTheDocument()
      })
    })

    it('displays available equipment in modal', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(testEquipment[0].name)).toBeInTheDocument()
        expect(screen.getByText(testEquipment[1].name)).toBeInTheDocument()
        expect(screen.getByText(testEquipment[2].name)).toBeInTheDocument()
      })
    })

    it('adds equipment to inventory when selected', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      // Wait for the equipment selector modal to open and find the button
      const hackingToolButton = await screen.findByRole('button', {
        name: new RegExp(testEquipment[0].name, 'i'),
      })
      await user.click(hackingToolButton)

      // Wait for modal to close
      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: new RegExp(testEquipment[0].name, 'i') })
        ).not.toBeInTheDocument()
      })

      // Equipment should be added to inventory
      await waitFor(() => {
        expect(screen.getAllByText(testEquipment[0].name).length).toBeGreaterThan(0)
      })
    })

    it('updates equipment count when adding equipment', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      // Add first equipment
      await user.click(addButton)
      const hackingToolButton = await screen.findByRole('button', {
        name: new RegExp(testEquipment[0].name, 'i'),
      })
      await user.click(hackingToolButton)

      await waitFor(() => {
        expect(within(inventorySection!).getByText(/1\/6/)).toBeInTheDocument()
      })

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // Add second equipment
      await user.click(addButton)

      const repairKitButton = await screen.findByRole('button', {
        name: new RegExp(testEquipment[1].name, 'i'),
      })
      await user.click(repairKitButton)

      await waitFor(() => {
        expect(within(inventorySection!).getByText(/2\/6/)).toBeInTheDocument()
      })
    })

    it('closes modal after selecting equipment', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })
      await user.click(addButton)

      const hackingToolButton = await screen.findByRole('button', {
        name: new RegExp(testEquipment[0].name, 'i'),
      })
      await user.click(hackingToolButton)

      await waitFor(() => {
        expect(screen.queryByText(/add equipment/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Inventory Capacity', () => {
    it('disables Add button when inventory is full (6/6)', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      // Add 6 items
      for (let i = 0; i < 6; i++) {
        await user.click(addButton)
        const hackingToolButton = await screen.findByRole('button', {
          name: new RegExp(testEquipment[0].name, 'i'),
        })
        await user.click(hackingToolButton)

        // Wait for modal to close
        await waitFor(
          () => {
            expect(screen.queryByText(/add equipment/i)).not.toBeInTheDocument()
          },
          { timeout: 3000 }
        )

        // Wait for equipment count to update
        await waitFor(
          () => {
            expect(
              within(inventorySection!).getByText(new RegExp(`${i + 1}/6`))
            ).toBeInTheDocument()
          },
          { timeout: 3000 }
        )
      }

      // Add button should now be disabled
      await waitFor(
        () => {
          expect(addButton).toBeDisabled()
        },
        { timeout: 3000 }
      )
    })

    it('shows 6/6 when inventory is full', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      // Add 6 items
      for (let i = 0; i < 6; i++) {
        await user.click(addButton)
        const hackingToolButton = await screen.findByRole('button', {
          name: new RegExp(testEquipment[0].name, 'i'),
        })
        await user.click(hackingToolButton)

        // Wait for modal to close (equipment modal auto-closes)
        await waitFor(
          () => {
            expect(screen.queryByText(/add equipment/i)).not.toBeInTheDocument()
          },
          { timeout: 3000 }
        )

        // Wait for equipment count to update
        await waitFor(
          () => {
            expect(
              within(inventorySection!).getByText(new RegExp(`${i + 1}/6`))
            ).toBeInTheDocument()
          },
          { timeout: 3000 }
        )
      }

      await waitFor(
        () => {
          expect(within(inventorySection!).getByText(/6\/6/)).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })

    it('enables Add button after removing equipment from full inventory', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      // Add 6 items
      for (let i = 0; i < 6; i++) {
        await user.click(addButton)
        const hackingToolButton = await screen.findByRole('button', {
          name: new RegExp(testEquipment[0].name, 'i'),
        })
        await user.click(hackingToolButton)

        // Wait for modal to close (equipment modal auto-closes)
        await waitFor(
          () => {
            expect(screen.queryByText(/add equipment/i)).not.toBeInTheDocument()
          },
          { timeout: 3000 }
        )

        // Wait for equipment count to update
        await waitFor(
          () => {
            expect(
              within(inventorySection!).getByText(new RegExp(`${i + 1}/6`))
            ).toBeInTheDocument()
          },
          { timeout: 3000 }
        )
      }

      // Add button should be disabled
      await waitFor(
        () => {
          expect(addButton).toBeDisabled()
        },
        { timeout: 3000 }
      )

      // Remove one item
      const removeButtons = screen.getAllByRole('button', { name: /remove equipment/i })
      await user.click(removeButtons[0])

      // Add button should be enabled again
      await waitFor(
        () => {
          expect(addButton).not.toBeDisabled()
        },
        { timeout: 3000 }
      )
    })
  })

  describe('Removing Equipment', () => {
    it('shows remove button on each equipment item', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      await user.click(addButton)
      const hackingToolButton = await screen.findByRole('button', {
        name: new RegExp(testEquipment[0].name, 'i'),
      })
      await user.click(hackingToolButton)

      // Wait for equipment count to update
      await waitFor(() => {
        expect(within(inventorySection!).getByText(/1\/6/)).toBeInTheDocument()
      })

      // Check for remove button - need to find the parent container with the button
      const removeButton = screen.getByRole('button', {
        name: /remove equipment/i,
      })
      expect(removeButton).toBeInTheDocument()
    })

    it('removes equipment when remove button is clicked', async () => {
      const user = userEvent.setup()
      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      await user.click(addButton)
      const hackingToolButton = await screen.findByRole('button', {
        name: new RegExp(testEquipment[0].name, 'i'),
      })
      await user.click(hackingToolButton)

      // Wait for equipment count to update
      await waitFor(() => {
        expect(within(inventorySection!).getByText(/1\/6/)).toBeInTheDocument()
      })

      const removeButton = screen.getByRole('button', { name: /remove equipment/i })
      await user.click(removeButton)

      await waitFor(() => {
        expect(screen.queryByText(testEquipment[0].name)).not.toBeInTheDocument()
      })
    })

    it('updates equipment count when removing equipment', async () => {
      const user = userEvent.setup()

      // Mock window.confirm to always return true
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      render(<PilotLiveSheet />)

      // Select a class first to enable inputs
      const classSelect = screen.getByRole('combobox', { name: /class/i })
      await user.selectOptions(classSelect, hackerClass.id)

      const inventorySection = screen.getByText(/^inventory$/i).closest('div')
      const addButton = within(inventorySection!).getByRole('button', { name: '+' })

      // Add two items
      await user.click(addButton)
      const hackingToolButton = await screen.findByRole('button', {
        name: new RegExp(testEquipment[0].name, 'i'),
      })
      await user.click(hackingToolButton)

      await waitFor(() => {
        expect(within(inventorySection!).getByText(/1\/6/)).toBeInTheDocument()
      })

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      await user.click(addButton)
      const repairKitButton = await screen.findByRole('button', {
        name: new RegExp(testEquipment[1].name, 'i'),
      })
      await user.click(repairKitButton)

      await waitFor(() => {
        expect(within(inventorySection!).getByText(/2\/6/)).toBeInTheDocument()
      })

      // Remove one item - get all remove buttons and click the first one
      const removeButtons = screen.getAllByRole('button', { name: /remove equipment/i })
      await user.click(removeButtons[0])

      await waitFor(() => {
        expect(within(inventorySection!).getByText(/1\/6/)).toBeInTheDocument()
      })

      confirmSpy.mockRestore()
    })
  })
})
