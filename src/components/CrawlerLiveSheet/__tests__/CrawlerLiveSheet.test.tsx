import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import CrawlerLiveSheet from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefCrawler, SURefCrawlerBay, SURefCrawlerTechLevel } from 'salvageunion-reference'

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

describe('CrawlerLiveSheet', () => {
  const mockCrawlers: SURefCrawler[] = [
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
      npc: {
        id: 'hauler-npc',
        name: 'Hauler Operator',
        type: 'npc',
        source: 'Test Source',
        page: 1,
        position: 'Operator',
        description: 'Operates the hauler',
        hitPoints: 10,
        abilities: [],
        notes: '',
        choices: [],
      },
    } as SURefCrawler,
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
      npc: {
        id: 'scout-npc',
        name: 'Scout Operator',
        type: 'npc',
        source: 'Test Source',
        page: 2,
        position: 'Scout',
        description: 'Operates the scout',
        hitPoints: 10,
        abilities: [],
        notes: '',
        choices: [],
      },
    } as SURefCrawler,
  ]

  const mockBays: SURefCrawlerBay[] = [
    {
      id: 'crew-quarters',
      name: 'Crew Quarters',
      source: 'Test Source',
      page: 1,
      description: 'Living space for crew',
      npc: {
        id: 'crew-npc',
        name: 'Crew Member',
        type: 'npc',
        source: 'Test Source',
        page: 1,
        position: 'Crew',
        description: 'A crew member',
        hitPoints: 10,
        abilities: [],
        notes: '',
        choices: [],
      },
      damagedEffect: '',
      techLevelEffects: [],
      abilities: [],
    } as SURefCrawlerBay,
    {
      id: 'engine-room',
      name: 'Engine Room',
      source: 'Test Source',
      page: 2,
      description: 'Powers the crawler',
      npc: {
        id: 'engineer-npc',
        name: 'Engineer',
        type: 'npc',
        source: 'Test Source',
        page: 2,
        position: 'Engineer',
        description: 'An engineer',
        hitPoints: 10,
        abilities: [],
        notes: '',
        choices: [],
      },
      damagedEffect: '',
      techLevelEffects: [],
      abilities: [],
    } as SURefCrawlerBay,
    {
      id: 'storage-bay',
      name: 'Storage Bay',
      source: 'Test Source',
      page: 3,
      description: 'Stores cargo and supplies',
      npc: {
        id: 'quartermaster-npc',
        name: 'Quartermaster',
        type: 'npc',
        source: 'Test Source',
        page: 3,
        position: 'Bullwhacker',
        description: 'A quartermaster',
        hitPoints: 10,
        abilities: [],
        notes: '',
        choices: [],
      },
      damagedEffect: '',
      techLevelEffects: [],
      abilities: [],
    } as SURefCrawlerBay,
  ]

  const mockTechLevels: SURefCrawlerTechLevel[] = [
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
      render(<CrawlerLiveSheet />)

      // Should have name input
      expect(screen.getByPlaceholderText(/enter crawler name/i)).toBeInTheDocument()
    })

    it('displays all main sections', () => {
      render(<CrawlerLiveSheet />)

      // Header inputs
      expect(screen.getByPlaceholderText(/enter crawler name/i)).toBeInTheDocument()
      const typeSelect = screen.getByRole('combobox')
      expect(typeSelect).toBeInTheDocument()

      // Resource steppers
      expect(screen.getByRole('group', { name: /SP/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /TL/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /UPGRADE/i })).toBeInTheDocument()
      expect(screen.getByText(/UPKEEP/i)).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /SCRAP/i })).toBeInTheDocument()

      // Notes section
      expect(screen.getByPlaceholderText(/add notes about your crawler/i)).toBeInTheDocument()
    })

    it('shows resource steppers with initial values', () => {
      render(<CrawlerLiveSheet />)

      // SP should start at 20/20
      const spStepper = screen.getByRole('group', { name: /SP/i })
      expect(within(spStepper).getByText('20/20')).toBeInTheDocument()

      // Tech Level should start at 1
      const techLevelStepper = screen.getByRole('group', { name: /TL/i })
      expect(within(techLevelStepper).getByText('1')).toBeInTheDocument()

      // Upgrade should start at 0/25
      const upgradeStepper = screen.getByRole('group', { name: /UPGRADE/i })
      expect(within(upgradeStepper).getByText('0/25')).toBeInTheDocument()

      // Scrap should start at 0
      const scrapStepper = screen.getByRole('group', { name: /SCRAP/i })
      expect(within(scrapStepper).getByText('0')).toBeInTheDocument()
    })

    it('displays all bay cards', () => {
      render(<CrawlerLiveSheet />)

      // Should show all bays
      expect(screen.getByText('Crew Quarters')).toBeInTheDocument()
      expect(screen.getByText('Engine Room')).toBeInTheDocument()
      expect(screen.getByText('Storage Bay')).toBeInTheDocument()
    })
  })

  describe('Type Selection', () => {
    it('loads and displays crawler type options', () => {
      render(<CrawlerLiveSheet />)

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
      render(<CrawlerLiveSheet />)

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
      render(<CrawlerLiveSheet />)

      const typeSelect = screen.getByRole('combobox')

      await user.selectOptions(typeSelect, 'crawler-hauler')

      expect(confirmSpy).not.toHaveBeenCalled()

      confirmSpy.mockRestore()
    })
  })

  describe('Resource Management', () => {
    it('allows adjusting SP value', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

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
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      const techLevelStepper = screen.getByRole('group', { name: /TL/i })
      const incrementButton = within(techLevelStepper).getByRole('button', {
        name: /Increment TL/i,
      })

      // Increment tech level
      await user.click(incrementButton)
      expect(within(techLevelStepper).getByText('2')).toBeInTheDocument()
    })

    it('allows adjusting upgrade value', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      const upgradeStepper = screen.getByRole('group', { name: /UPGRADE/i })
      const incrementButton = within(upgradeStepper).getByRole('button', {
        name: /Increment UPGRADE/i,
      })

      await user.click(incrementButton)
      expect(within(upgradeStepper).getByText('1/25')).toBeInTheDocument()
    })

    it('allows adjusting scrap value', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      const scrapStepper = screen.getByRole('group', { name: /SCRAP/i })
      const incrementButton = within(scrapStepper).getByRole('button', {
        name: /Increment SCRAP/i,
      })

      // Increment scrap
      await user.click(incrementButton)
      expect(within(scrapStepper).getByText('1')).toBeInTheDocument()
    })

    it('updates upkeep display when tech level changes', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      // Initial upkeep should be 5 TL1
      expect(screen.getByText('5 TL1')).toBeInTheDocument()

      const techLevelStepper = screen.getByRole('group', { name: /TL/i })
      const incrementButton = within(techLevelStepper).getByRole('button', {
        name: /Increment TL/i,
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
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      // First, increment upgrade
      const upgradeStepper = screen.getByRole('group', { name: /UPGRADE/i })
      const upgradeIncrementButton = within(upgradeStepper).getByRole('button', {
        name: /Increment UPGRADE/i,
      })
      await user.click(upgradeIncrementButton)
      expect(within(upgradeStepper).getByText('1/25')).toBeInTheDocument()

      // Now increment tech level
      const techLevelStepper = screen.getByRole('group', { name: /TL/i })
      const techLevelIncrementButton = within(techLevelStepper).getByRole('button', {
        name: /Increment TL/i,
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
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      const nameInput = screen.getByPlaceholderText(/enter crawler name/i)

      await user.type(nameInput, 'The Iron Beast')
      expect(nameInput).toHaveValue('The Iron Beast')
    })

    it('allows entering description', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      const descriptionInput = screen.getByPlaceholderText(/enter crawler description/i)

      await user.type(descriptionInput, 'A mighty crawler')
      expect(descriptionInput).toHaveValue('A mighty crawler')
    })
  })

  describe('Bay Management', () => {
    it('allows entering operator for a bay', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      // Find the Crew Quarters bay operator input (placeholder is "Enter Crew name...")
      const operatorInput = screen.getByPlaceholderText(/enter crew name/i)

      await user.type(operatorInput, 'Captain Smith')
      expect(operatorInput).toHaveValue('Captain Smith')
    })

    it('allows entering description for a bay', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      // Find bay notes inputs (placeholder is "Enter operator notes...")
      const bayNotes = screen.getAllByPlaceholderText(/enter operator notes/i)
      const firstBayNotes = bayNotes[0]

      await user.type(firstBayNotes, 'Comfortable quarters')
      expect(firstBayNotes).toHaveValue('Comfortable quarters')
    })
  })

  describe('Storage Bay', () => {
    it('displays storage bay separately from other bays', () => {
      render(<CrawlerLiveSheet />)

      // Storage Bay should be visible
      expect(screen.getByText('Storage Bay')).toBeInTheDocument()
    })

    it('shows add cargo button', () => {
      render(<CrawlerLiveSheet />)

      expect(screen.getByRole('button', { name: /\+/i })).toBeInTheDocument()
    })

    it('opens cargo modal when add cargo is clicked', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      const addCargoButton = screen.getByRole('button', { name: /\+/i })

      await user.click(addCargoButton)

      // Modal should be visible with the cargo description input
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter cargo description/i)).toBeInTheDocument()
      })
    })
  })

  describe('Notes', () => {
    it('shows notes section', () => {
      render(<CrawlerLiveSheet />)

      expect(screen.getByPlaceholderText(/add notes about your crawler/i)).toBeInTheDocument()
    })

    it('allows entering notes text', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, 'crawler-hauler')

      const notesTextarea = screen.getByPlaceholderText(/add notes about your crawler/i)

      await user.type(notesTextarea, 'This crawler has seen better days')
      expect(notesTextarea).toHaveValue('This crawler has seen better days')
    })
  })
})
