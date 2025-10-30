import type { ReactNode } from 'react'
import type { ButtonProps } from '@chakra-ui/react'
import type { SURefEquipment } from 'salvageunion-reference'
import { EntityDisplay } from '../../entity/EntityDisplay'
import { ENTITY_DISPLAY_CONFIGS } from './entityDisplayConfig'

interface EquipmentDisplayProps {
  data: SURefEquipment
  onClick?: () => void
  buttonConfig?: ButtonProps & { children: ReactNode }
  children?: ReactNode
  hideActions?: boolean
}

/**
 * Equipment display component.
 * Uses the factory pattern configuration for consistent styling.
 */
export function EquipmentDisplay({
  data,
  onClick,
  buttonConfig,
  children,
  hideActions = false,
}: EquipmentDisplayProps) {
  const config = ENTITY_DISPLAY_CONFIGS.equipment || {}
  return (
    <EntityDisplay
      schemaName="equipment"
      data={data}
      onClick={onClick}
      buttonConfig={buttonConfig}
      hideActions={hideActions}
      {...config}
    >
      {children}
    </EntityDisplay>
  )
}
