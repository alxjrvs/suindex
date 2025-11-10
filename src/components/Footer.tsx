import { Box, Flex, Image, Link, Text } from '@chakra-ui/react'

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="su.white"
      borderTopWidth="1px"
      borderTopColor="su.lightBlue"
      py={3}
      shadow={{ base: 'none', lg: 'sm' }}
    >
      <Flex
        maxW="7xl"
        mx="auto"
        color="su.black"
        fontSize="xs"
        alignItems="center"
        justifyContent="center"
        gap={4}
        flexDirection={{ base: 'column', lg: 'row' }}
      >
        <Box textAlign="center">
          <Text>
            Salvage Union is copyrighted by{' '}
            <Link
              href="https://leyline.press"
              target="_blank"
              rel="noopener noreferrer"
              textDecoration="underline"
              _hover={{ color: 'su.brick' }}
            >
              Leyline Press
            </Link>
            .
          </Text>
          <Text>
            Salvage Union and the "Powered by Salvage" logo are used with permission of Leyline
            Press, under the{' '}
            <Link
              href="https://leyline.press/pages/salvage-union-open-game-licence-1-0b"
              target="_blank"
              rel="noopener noreferrer"
              textDecoration="underline"
              _hover={{ color: 'su.brick' }}
            >
              Salvage Union Open Game Licence 1.0b
            </Link>
            .
          </Text>
          <Text>
            All Workshop Manual Images are used with special permission from{' '}
            <Link
              href="https://leyline.press"
              target="_blank"
              rel="noopener noreferrer"
              textDecoration="underline"
              _hover={{ color: 'su.brick' }}
            >
              Leyline Press
            </Link>
            .
          </Text>
        </Box>
        <Image src="/Powered_by_Salvage_Black.webp" alt="Powered by Salvage" h="12" w="auto" />
      </Flex>
    </Box>
  )
}
