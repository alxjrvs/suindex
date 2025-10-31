import { SheetDisplay } from '../../shared/SheetDisplay'
import { Text } from '../../base/Text'
import type { EntityDisplaySubProps } from './types'
import { Fragment } from 'react/jsx-runtime'

export function EntityRequirementDisplay({ data, compact }: EntityDisplaySubProps) {
  if (!('requirement' in data) || !data.requirement || data.requirement.length === 0) return null

  return (
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
  )
}
