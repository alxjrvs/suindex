import { SheetDisplay } from '../../shared/SheetDisplay'
import { Text } from '../../base/Text'
import { Fragment } from 'react/jsx-runtime'
import { Flex } from '@chakra-ui/react'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityRequirementDisplay() {
  const { data, spacing, compact } = useEntityDisplayContext()
  if (!('requirement' in data) || !data.requirement || data.requirement.length === 0) return null

  return (
    <Flex p={spacing.contentPadding}>
      <SheetDisplay
        compact={compact}
        label="Requirements"
        labelBgColor="su.brick"
        borderColor="su.brick"
      >
        {data.requirement.map((req, index) => (
          <Fragment key={req + '-' + index}>
            <Text as="span" key={index}>
              <Text as="span" fontWeight="bold">
                {req}
                {' tree'}
              </Text>
            </Text>
            {index < data.requirement.length - 1 && <Text>OR</Text>}
          </Fragment>
        ))}
      </SheetDisplay>
    </Flex>
  )
}
