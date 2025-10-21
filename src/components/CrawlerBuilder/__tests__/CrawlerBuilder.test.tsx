import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CrawlerBuilder from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Crawler, CrawlerBay, CrawlerTechLevel } from 'salvageunion-reference'

// Mock the SalvageUnionReference
vi.mock('salvageunion-reference', () => ({
  SalvageUnionReference: {
    Crawlers: {
      all: vi.fn(),
    },
    CrawlerBays: {
      all: vi.fn(),
    },
    CrawlerTechLevels: {
      all: vi.fn(),
    },
  },
}))

describe('CrawlerBuilder', () => {
  const mockCrawlers: Crawler[] = [
    {
      id: 'crawler-hauler',
      name: 'Hauler',
      source: 'Test Source',
      page: 1,
      description: 'A heavy cargo crawler',
      abilities: [
        {
          name: 'Heavy Load',
          description: 'Can carry extra cargo',
        },
      ],
    } as Crawler,
    {
      id: 'crawler-scout',
      name: 'Scout',
      source: 'Test Source',
      page: 2,
      description: 'A fast reconnaissance crawler',
      abilities: [
        {
          name: 'Quick Movement',
          description: 'Moves faster than other crawlers',
        },
      ],
    } as Crawler,
  ]

  const mockBays: CrawlerBay[] = [
    {
      id: 'crew-quarters',
      name: 'Crew Quarters',
      source: 'Test Source',
      page: 1,
      description: 'Living space for crew',
      operatorPosition: 'Crew',
      damagedEffect: '',
      operatorHitPoints: 10,
      techLevelEffects: [],
      abilities: [],
      notes: '',
    } as CrawlerBay,
    {
      id: 'engine-room',
      name: 'Engine Room',
      source: 'Test Source',
      page: 2,
      description: 'Powers the crawler',
      operatorPosition: 'Engineer',
      damagedEffect: '',
      operatorHitPoints: 10,
      techLevelEffects: [],
      abilities: [],
      notes: '',
    } as CrawlerBay,
    {
      id: 'storage-bay',
      name: 'Storage Bay',
      source: 'Test Source',
      page: 3,
      description: 'Stores cargo and supplies',
      operatorPosition: 'Quartermaster',
      damagedEffect: '',
      operatorHitPoints: 10,
      techLevelEffects: [],
      abilities: [],
      notes: '',
    } as CrawlerBay,
  ]

  const mockTechLevels: CrawlerTechLevel[] = [
    {
      id: 'tech-level-1',
      name: 'Tech Level 1',
      techLevel: 1,
      structurePoints: 20,
      populationMin: 10,
      populationMax: 50,
      source: 'Test Source',
      page: 1,
    },
    {
      id: 'tech-level-2',
      name: 'Tech Level 2',
      techLevel: 2,
      structurePoints: 30,
      populationMin: 50,
      populationMax: 100,
      source: 'Test Source',
      page: 2,
    },
  ]

  beforeEach(() => {
    vi.mocked(SalvageUnionReference.Crawlers.all).mockReturnValue(mockCrawlers)
    vi.mocked(SalvageUnionReference.CrawlerBays.all).mockReturnValue(mockBays)
    vi.mocked(SalvageUnionReference.CrawlerTechLevels.all).mockReturnValue(mockTechLevels)
  })

  describe('Initial Render', () => {
    it('renders the crawler builder interface', () => {
      render(<CrawlerBuilder />)

      // Should have name input
      expect(screen.getByPlaceholderText(/enter crawler name/i)).toBeInTheDocument()
    })

    it('displays all main sections', () => {
      render(<CrawlerBuilder />)

      // Header inputs
      expect(screen.getByPlaceholderText(/enter crawler name/i)).toBeInTheDocument()
      const typeSelect = screen.getByRole('combobox')
      expect(typeSelect).toBeInTheDocument()

      // Resource steppers
      expect(screen.getByText(/SP/i)).toBeInTheDocument()
      expect(screen.getByText(/TECH LVL/i)).toBeInTheDocument()
      expect(screen.getByText(/UPGRADE/i)).toBeInTheDocument()
      expect(screen.getByText(/UPKEEP/i)).toBeInTheDocument()
      expect(screen.getByText(/TL1 SCRAP/i)).toBeInTheDocument()

      // Notes section
      expect(screen.getByPlaceholderText(/add notes about your crawler/i)).toBeInTheDocument()
    })

    it('shows resource steppers with initial values', () => {
      render(<CrawlerBuilder />)

      // SP should start at 20/20
      const spStepper = screen.getByRole('group', { name: /SP/i })
      expect(within(spStepper).getByText('20/20')).toBeInTheDocument()

      // Tech Level should start at 1
      const techLevelStepper = screen.getByRole('group', { name: /TECH LVL/i })
      expect(within(techLevelStepper).getByText('1')).toBeInTheDocument()

      // Upgrade should start at 0/25
      const upgradeStepper = screen.getByRole('group', { name: /UPGRADE/i })
      expect(within(upgradeStepper).getByText('0/25')).toBeInTheDocument()

      // Scrap should start at 0
      const scrapStepper = screen.getByRole('group', { name: /TL1 SCRAP/i })
      expect(within(scrapStepper).getByText('0')).toBeInTheDocument()
    })

    it('displays all bay cards', () => {
      render(<CrawlerBuilder />)

      // Should show all bays
      expect(screen.getByText('Crew Quarters')).toBeInTheDocument()
      expect(screen.getByText('Engine Room')).toBeInTheDocument()
      expect(screen.getByText('Storage Bay')).toBeInTheDocument()
    })
  })

  describe('Type Selection', () => {
    it('loads and displays crawler type options', () => {
      render(<CrawlerBuilder />)

      const typeSelect = screen.getByRole('combobox')
      expect(typeSelect).toBeInTheDocument()

      // Should have placeholder option
      expect(screen.getByText(/select crawler type/i)).toBeInTheDocument()

      // Should have crawler options
      expect(screen.getByRole('option', { name: /hauler/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /scout/i })).toBeInTheDocument()
    })

    it('displays abilities when crawler type is selected', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      const typeSelect = screen.getByRole('combobox')

      await user.selectOptions(typeSelect, 'crawler-hauler')

      await waitFor(() => {
        expect(screen.getByText('Heavy Load')).toBeInTheDocument()
        expect(screen.getByText('Can carry extra cargo')).toBeInTheDocument()
      })
    })

    it('does not show confirmation alert on first type selection', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm')
      render(<CrawlerBuilder />)

      const typeSelect = screen.getByRole('combobox')

      await user.selectOptions(typeSelect, 'crawler-hauler')

      expect(confirmSpy).not.toHaveBeenCalled()

      confirmSpy.mockRestore()
    })

    it('shows confirmation alert when changing type after initial selection', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      render(<CrawlerBuilder />)

      const typeSelect = screen.getByRole('combobox')

      // Select first type
      await user.selectOptions(typeSelect, 'crawler-hauler')

      // Change to second type
      await user.selectOptions(typeSelect, 'crawler-scout')

      await waitFor(() => {
        expect(confirmSpy).toHaveBeenCalledWith(
          'Alert - changing this will reset all data. Change type and reset crawler data?'
        )
      })

      confirmSpy.mockRestore()
    })

    it('cancels type change when user declines confirmation', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      render(<CrawlerBuilder />)

      const typeSelect = screen.getByRole('combobox')

      // Select first type
      await user.selectOptions(typeSelect, 'crawler-hauler')

      await waitFor(() => {
        expect(screen.getByText('Heavy Load')).toBeInTheDocument()
      })

      // Try to change to second type
      await user.selectOptions(typeSelect, 'crawler-scout')

      await waitFor(() => {
        expect(confirmSpy).toHaveBeenCalled()
      })

      // Should still show first type's abilities
      expect(screen.getByText('Heavy Load')).toBeInTheDocument()
      expect(screen.queryByText('Quick Movement')).not.toBeInTheDocument()

      confirmSpy.mockRestore()
    })

    it('resets all crawler data when type change is confirmed', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      render(<CrawlerBuilder />)

      const typeSelect = screen.getByRole('combobox')
      const nameInput = screen.getByPlaceholderText(/enter crawler name/i)

      // Select first type and add some data
      await user.selectOptions(typeSelect, 'crawler-hauler')
      await user.type(nameInput, 'Test Crawler')
      expect(nameInput).toHaveValue('Test Crawler')

      // Change type and confirm
      await user.selectOptions(typeSelect, 'crawler-scout')

      await waitFor(() => {
        // Name should be reset
        expect(nameInput).toHaveValue('')
        // Confirm should have been called
        expect(confirmSpy).toHaveBeenCalled()
      })

      confirmSpy.mockRestore()
    })
  })

  describe('Resource Management', () => {
    it('allows adjusting SP value', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      const spStepper = screen.getByRole('group', { name: /SP/i })
      const decrementButton = within(spStepper).getByRole('button', { name: /Decrement SP/i })

      // SP starts at max (20/20), so we can only decrement
      await user.click(decrementButton)
      expect(within(spStepper).getByText('19/20')).toBeInTheDocument()

      // Decrement again
      await user.click(decrementButton)
      expect(within(spStepper).getByText('18/20')).toBeInTheDocument()
    })

    it('allows adjusting tech level', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      const techLevelStepper = screen.getByRole('group', { name: /TECH LVL/i })
      const incrementButton = within(techLevelStepper).getByRole('button', {
        name: /Increment TECH LVL/i,
      })

      // Increment tech level
      await user.click(incrementButton)
      expect(within(techLevelStepper).getByText('2')).toBeInTheDocument()
    })

    it('allows adjusting upgrade value', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      const upgradeStepper = screen.getByRole('group', { name: /UPGRADE/i })
      const incrementButton = within(upgradeStepper).getByRole('button', {
        name: /Increment UPGRADE/i,
      })

      // Increment upgrade (step is 5, so it goes from 0 to 5)
      await user.click(incrementButton)
      expect(within(upgradeStepper).getByText('5/25')).toBeInTheDocument()
    })

    it('allows adjusting scrap value', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      const scrapStepper = screen.getByRole('group', { name: /TL1 SCRAP/i })
      const incrementButton = within(scrapStepper).getByRole('button', {
        name: /Increment TL1 SCRAP/i,
      })

      // Increment scrap
      await user.click(incrementButton)
      expect(within(scrapStepper).getByText('1')).toBeInTheDocument()
    })

    it('updates upkeep display when tech level changes', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      // Initial upkeep should be 5 TL1
      expect(screen.getByText('5 TL1')).toBeInTheDocument()

      const techLevelStepper = screen.getByRole('group', { name: /TECH LVL/i })
      const incrementButton = within(techLevelStepper).getByRole('button', {
        name: /Increment TECH LVL/i,
      })

      // Increment tech level
      await user.click(incrementButton)

      // Upkeep should update to 5 TL2
      await waitFor(() => {
        expect(screen.getByText('5 TL2')).toBeInTheDocument()
      })
    })

    it('resets upgrade to 0 when tech level changes', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      // First, increment upgrade
      const upgradeStepper = screen.getByRole('group', { name: /UPGRADE/i })
      const upgradeIncrementButton = within(upgradeStepper).getByRole('button', {
        name: /Increment UPGRADE/i,
      })
      await user.click(upgradeIncrementButton)
      expect(within(upgradeStepper).getByText('5/25')).toBeInTheDocument()

      // Now increment tech level
      const techLevelStepper = screen.getByRole('group', { name: /TECH LVL/i })
      const techLevelIncrementButton = within(techLevelStepper).getByRole('button', {
        name: /Increment TECH LVL/i,
      })
      await user.click(techLevelIncrementButton)

      // Upgrade should be reset to 0
      await waitFor(() => {
        expect(within(upgradeStepper).getByText('0/25')).toBeInTheDocument()
      })
    })
  })

  describe('Header Inputs', () => {
    it('allows entering crawler name', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      const nameInput = screen.getByPlaceholderText(/enter crawler name/i)

      await user.type(nameInput, 'The Iron Beast')
      expect(nameInput).toHaveValue('The Iron Beast')
    })

    it('allows entering description', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      const descriptionInput = screen.getByPlaceholderText(/enter crawler description/i)

      await user.type(descriptionInput, 'A mighty crawler')
      expect(descriptionInput).toHaveValue('A mighty crawler')
    })
  })

  describe('Bay Management', () => {
    it('allows entering operator for a bay', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      // Find the Crew Quarters bay operator input (placeholder is "Enter Crew name...")
      const operatorInput = screen.getByPlaceholderText(/enter crew name/i)

      await user.type(operatorInput, 'Captain Smith')
      expect(operatorInput).toHaveValue('Captain Smith')
    })

    it('allows entering description for a bay', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      // Find bay description inputs (placeholder is "Enter bay description...")
      const bayDescriptions = screen.getAllByPlaceholderText(/enter bay description/i)
      const firstBayDescription = bayDescriptions[0]

      await user.type(firstBayDescription, 'Comfortable quarters')
      expect(firstBayDescription).toHaveValue('Comfortable quarters')
    })
  })

  describe('Storage Bay', () => {
    it('displays storage bay separately from other bays', () => {
      render(<CrawlerBuilder />)

      // Storage Bay should be visible
      expect(screen.getByText('Storage Bay')).toBeInTheDocument()
    })

    it('allows entering storage bay operator', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      // Storage bay operator is labeled "Bullwhacker"
      const operatorInput = screen.getByPlaceholderText(/enter bullwhacker name/i)

      await user.type(operatorInput, 'Quartermaster Jones')
      expect(operatorInput).toHaveValue('Quartermaster Jones')
    })

    it('shows add cargo button', () => {
      render(<CrawlerBuilder />)

      expect(screen.getByRole('button', { name: /\+ add/i })).toBeInTheDocument()
    })

    it('opens cargo modal when add cargo is clicked', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      const addCargoButton = screen.getByRole('button', { name: /\+ add/i })

      await user.click(addCargoButton)

      // Modal should be visible with the cargo description input
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter cargo description/i)).toBeInTheDocument()
      })
    })
  })

  describe('Notes', () => {
    it('shows notes section', () => {
      render(<CrawlerBuilder />)

      expect(screen.getByPlaceholderText(/add notes about your crawler/i)).toBeInTheDocument()
    })

    it('allows entering notes text', async () => {
      const user = userEvent.setup()
      render(<CrawlerBuilder />)

      const notesTextarea = screen.getByPlaceholderText(/add notes about your crawler/i)

      await user.type(notesTextarea, 'This crawler has seen better days')
      expect(notesTextarea).toHaveValue('This crawler has seen better days')
    })
  })
})
