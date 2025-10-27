import { DialogRoot, DialogContent, DialogBody, DialogCloseTrigger } from '@chakra-ui/react'
import type { SURefSchemaName } from 'salvageunion-reference'
import { EntityDisplay } from './EntityDisplay'
import { lookupEntityByRef } from '../../utils/referenceUtils'

interface EntityDisplayModalProps {
  isOpen: boolean
  onClose: () => void
  schemaName: SURefSchemaName | null
  entityId: string | null
}

/**
 * Modal that displays an entity using EntityDisplay component.
 * Used for showing detailed entity information when clicking on cargo items.
 */
export function EntityDisplayModal({
  isOpen,
  onClose,
  schemaName,
  entityId,
}: EntityDisplayModalProps) {
  // Only render the dialog content if we have valid data
  const hasValidData = schemaName && entityId
  const ref = hasValidData ? `${schemaName}||${entityId}` : null
  const entity = ref ? lookupEntityByRef(ref) : null

  return (
    <DialogRoot
      open={!!(isOpen && hasValidData && entity)}
      onOpenChange={(e) => !e.open && onClose()}
      size="lg"
    >
      <DialogContent>
        <DialogCloseTrigger />
        <DialogBody p={0}>
          {entity && schemaName && (
            <EntityDisplay schemaName={schemaName} data={entity} collapsible={false} />
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}
