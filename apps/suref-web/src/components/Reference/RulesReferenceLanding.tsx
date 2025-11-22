import { Box, Flex, Link } from '@chakra-ui/react'
import { Text } from '@/components/base/Text'
import { ReferenceHeader } from '@/components/shared/ReferenceHeader'
import Footer from '@/components/Footer'

export function RulesReferenceLanding() {
  return (
    <Flex flexDirection="column" bg="bg.landing" h="full" w="full">
      <Flex flex="1" alignItems="center" justifyContent="center" w="full">
        <ReferenceHeader
          title={
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
              width="100%"
            >
              <Text
                as="span"
                variant="pseudoheader"
                fontSize="2xl"
                textAlign="center"
                display="inline-block"
                alignSelf="center"
              >
                Salvage Union
              </Text>
              <Text
                as="span"
                fontSize="2xl"
                color="brand.srd"
                fontWeight="medium"
                bg="transparent"
                textAlign="center"
              >
                System Reference Document
              </Text>
              <Text fontSize="sm" color="brand.srd" textAlign="center">
                An SRD for the{' '}
                <Link
                  href="https://leyline.press/collections/salvage-union"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="brand.srd"
                  textDecoration="underline"
                  _hover={{ color: 'su.orange' }}
                >
                  Salvage Union
                </Link>{' '}
                TTRPG
              </Text>
            </Box>
          }
        ></ReferenceHeader>
      </Flex>

      <Footer />
    </Flex>
  )
}
