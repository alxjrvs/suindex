import { Box, Flex, Image, Link, Text } from '@chakra-ui/react'

interface FooterProps {
  variant?: 'landing' | 'inner' | 'nav'
}

export default function Footer({ variant = 'inner' }: FooterProps) {
  if (variant === 'nav') {
    return (
      <Box as="footer" bg="su.white" borderTopWidth="1px" borderTopColor="su.lightBlue" py={3}>
        <Flex
          px={4}
          color="su.black"
          fontSize="xs"
          flexDirection="column"
          alignItems="center"
          gap={3}
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
          </Box>
          <Image src="/Powered_by_Salvage_Black.webp" alt="Powered by Salvage" h="12" w="auto" />
        </Flex>
      </Box>
    )
  }

  if (variant === 'landing') {
    return (
      <Box as="footer" bg="transparent" py={3} mt="auto">
        <Flex
          maxW="7xl"
          mx="auto"
          color="su.black"
          fontSize="xs"
          alignItems="center"
          justifyContent="center"
          gap={4}
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
          </Box>
          <Image src="/Powered_by_Salvage_Black.webp" alt="Powered by Salvage" h="12" w="auto" />
        </Flex>
      </Box>
    )
  }

  return (
    <Box as="footer" bg="su.green" borderTopWidth="1px" borderTopColor="su.black" py={3} mt="auto">
      <Flex
        maxW="7xl"
        mx="auto"
        color="su.black"
        fontSize="xs"
        alignItems="center"
        justifyContent="center"
        gap={4}
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
        </Box>
        <Image src="/Powered_by_Salvage_Black.webp" alt="Powered by Salvage" h="12" w="auto" />
      </Flex>
    </Box>
  )
}
