import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '.././base/Heading'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import { GridTileButton, CreateTileButton } from './GridTile'
import { NewCrawlerModal } from './NewCrawlerModal'
import { useEntityGrid } from '../../hooks/useEntityGrid'

type CrawlerRow = Tables<'crawlers'>

export function CrawlersGrid() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    items: crawlers,
    loading,
    error,
    reload,
  } = useEntityGrid<CrawlerRow>({
    table: 'crawlers',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const handleCreateCrawler = () => {
    setIsModalOpen(true)
  }

  const handleCrawlerClick = (crawlerId: string) => {
    navigate(`/dashboard/crawlers/${crawlerId}`)
  }

  const handleModalSuccess = () => {
    reload()
  }

  if (loading) {
    return (
      <Box p={8}>
        <Flex align="center" justify="center" minH="60vh">
          <Text fontSize="xl" color="su.brick">
            Loading crawlers...
          </Text>
        </Flex>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={8}>
        <VStack align="center" justify="center" minH="60vh" gap={4}>
          <Text fontSize="xl" color="red.600">
            {error}
          </Text>
          <Button
            onClick={reload}
            bg="su.brick"
            color="su.white"
            fontWeight="bold"
            py={2}
            px={6}
            _hover={{ opacity: 0.9 }}
          >
            Retry
          </Button>
        </VStack>
      </Box>
    )
  }

  // If no crawlers, show the centered "Create Crawler" button
  if (crawlers.length === 0) {
    return (
      <Box p={8}>
        <Flex align="center" justify="center" minH="60vh">
          <VStack textAlign="center" gap={8}>
            <Heading level="h2" color="su.black">
              Your Crawlers
            </Heading>
            <Text fontSize="lg" color="su.brick">
              You don't have any crawlers yet. Create your first crawler to get started!
            </Text>
            <Button
              onClick={handleCreateCrawler}
              bg="su.pink"
              color="su.white"
              fontWeight="bold"
              py={4}
              px={8}
              fontSize="xl"
              _hover={{ opacity: 0.9 }}
              boxShadow="lg"
            >
              Create Crawler
            </Button>
          </VStack>
        </Flex>

        <NewCrawlerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </Box>
    )
  }

  // Show crawlers grid
  return (
    <Box p={8}>
      <Box mb={8}>
        <Heading level="h1" color="su.black">
          Your Crawlers
        </Heading>
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {/* Existing crawlers */}
        {crawlers.map((crawler) => {
          const crawlerTypeName = crawler.crawler_type_id
            ? (SalvageUnionReference.Crawlers.all().find((c) => c.id === crawler.crawler_type_id)
                ?.name ?? 'Unknown')
            : 'Unknown'

          const maxSP = crawler.tech_level
            ? (SalvageUnionReference.CrawlerTechLevels.all().find(
                (tl) => tl.techLevel === crawler.tech_level
              )?.structurePoints ?? 20)
            : 20
          const currentSP = maxSP - (crawler.current_damage ?? 0)

          return (
            <GridTileButton key={crawler.id} onClick={() => handleCrawlerClick(crawler.id)} h="48" p={6}>
              <Heading level="h3" lineClamp={1}>
                {crawler.name}
              </Heading>
              <Text fontSize="sm" color="su.black" opacity={0.8} lineClamp={1}>
                {crawlerTypeName}
              </Text>
              <Text fontSize="sm" color="su.black" opacity={0.8} mt="auto">
                SP: {currentSP}/{maxSP}
              </Text>
            </GridTileButton>
          )
        })}

        {/* Create Crawler cell */}
        <CreateTileButton
          onClick={handleCreateCrawler}
          label="New Crawler"
          accentColor="su.crawlerPink"
          bgColor="su.lightPeach"
          h="48"
          p={6}
        />
      </Grid>

      <NewCrawlerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </Box>
  )
}
