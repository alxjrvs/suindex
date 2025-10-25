import { Box, Link, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'

interface LiveSheetHeaderProps {
  title: string
}

export function LiveSheetHeader({ title }: LiveSheetHeaderProps) {
  return (
    <Box
      bg="su.white"
      shadow="sm"
      borderBottomWidth="1px"
      borderColor="su.lightBlue"
      p={6}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Heading level="h2" textAlign="center" alignSelf="center" mb={4}>
        {title}
      </Heading>

      <VStack gap={2} alignItems="center" textAlign="center">
        <Text fontSize="sm" color="su.brick">
          This is a draft sheet. Changes are not saved to a database and will be reset when you
          refresh the page.
        </Text>
        <Text fontSize="sm" color="su.black">
          To persist your live sheets,{' '}
          <Link
            href="/dashboard"
            color="su.orange"
            fontWeight="semibold"
            _hover={{ textDecoration: 'underline' }}
          >
            log in to the dashboard
          </Link>
          .
        </Text>
      </VStack>
    </Box>
  )
}
