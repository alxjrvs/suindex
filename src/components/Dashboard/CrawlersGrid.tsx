import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '.././base/Heading'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import CrawlerCard from '../CrawlerCard'
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

          return (
            <Button
              key={crawler.id}
              onClick={() => handleCrawlerClick(crawler.id)}
              variant="plain"
              p={0}
              _hover={{ transform: 'scale(1.05)' }}
              transition="transform 0.2s"
            >
              <CrawlerCard
                name={crawler.name}
                typeName={crawlerTypeName}
                maxSP={maxSP}
                currentDamage={crawler.current_damage ?? 0}
              />
            </Button>
          )
        })}

        {/* Create Crawler cell */}
        <Button
          onClick={handleCreateCrawler}
          bg="#f5c1a3"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="su.pink"
          borderRadius="lg"
          p={6}
          h="120px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: 'su.pink', borderStyle: 'solid', '& > *': { color: 'su.white' } }}
        >
          <Text fontSize="5xl" color="su.pink" mb={2}>
            +
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="su.pink">
            Create Crawler
          </Text>
        </Button>
      </Grid>

      <NewCrawlerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </Box>
  )
}
