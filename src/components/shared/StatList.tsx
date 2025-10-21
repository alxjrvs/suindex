import { Box, Flex, Text } from '@chakra-ui/react'

interface Stat {
  label: string
  value: string | number | undefined
}

interface StatListProps {
  stats: Stat[]
  notes?: string
  up?: boolean
}

export function StatList({ stats, notes, up = false }: StatListProps) {
  return (
    <Box>
      {!up && notes && (
        <Text fontSize="sm" fontWeight="bold" color="su.black" mb={2}>
          {notes}
        </Text>
      )}
      <Flex flexDirection="row" overflow="visible" pt={up ? 20 : 0}>
        {stats.map((stat, index) => (
          <StatItem key={index} label={stat.label} value={stat.value} up={up} />
        ))}
      </Flex>
      {up && notes && (
        <Text fontSize="sm" fontWeight="bold" color="su.black" mt={2}>
          {notes}
        </Text>
      )}
    </Box>
  )
}

function StatItem({
  label,
  value,
  up,
}: {
  label: string
  value: string | number | undefined
  up: boolean
}) {
  return (
    <Flex flexDirection="row" position="relative" overflow="visible">
      <StatLabel up={up}>{label}</StatLabel>
      <StatValue>{value ?? '-'}</StatValue>
    </Flex>
  )
}

function StatValue({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg="su.white"
      borderWidth="2px"
      borderColor="su.black"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="bold"
      color="su.black"
      w="30px"
      h="30px"
      minW="30px"
      minH="30px"
      maxW="30px"
      maxH="30px"
      zIndex={3}
      overflow="visible"
    >
      {children}
    </Box>
  )
}

function StatLabel({ children, up }: { children: React.ReactNode; up: boolean }) {
  return (
    <Box
      position="absolute"
      display="flex"
      alignItems="center"
      justifyContent={up ? 'flex-start' : 'flex-end'}
      transform="rotate(-45deg)"
      transformOrigin="left"
      minW="140px"
      h="14px"
      zIndex={2}
      overflow="visible"
      top={up ? '0' : undefined}
      left={up ? '9px' : '-75px'}
      bottom={up ? undefined : '-95px'}
    >
      <Box
        bg="su.black"
        color="su.white"
        fontWeight="black"
        fontSize="11px"
        textTransform="uppercase"
        whiteSpace="nowrap"
        pr={up ? '5px' : '22px'}
        pl={up ? '22px' : '5px'}
        pt="1px"
        textAlign="right"
      >
        {children}
      </Box>
    </Box>
  )
}
