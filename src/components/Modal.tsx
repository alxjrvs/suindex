import type { ReactNode } from 'react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogBackdrop,
  DialogCloseTrigger,
  DialogPositioner,
} from '@chakra-ui/react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  backgroundColor?: string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  backgroundColor = 'su.mediumGrey',
}: ModalProps) {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="xl"
      placement="center"
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent
          maxW="6xl"
          maxH="90vh"
          bg={backgroundColor}
          borderWidth="3px"
          borderColor="su.black"
          borderRadius="24px"
          shadow="lg"
        >
          <DialogHeader
            bg="su.orange"
            borderBottomWidth="4px"
            borderBottomColor="su.black"
            borderTopRadius="24px"
            pl={6}
            pr={2}
            py={2}
            w="full"
            justifyContent="space-between"
            alignItems="center"
          >
            <DialogTitle fontSize="2xl" fontWeight="bold" color="su.white">
              {title}
            </DialogTitle>
            <DialogCloseTrigger
              color="su.white"
              _hover={{ color: 'su.lightOrange' }}
              fontSize="3xl"
              fontWeight="bold"
            />
          </DialogHeader>
          <DialogBody flex="1" overflowY="auto" p={6}>
            {children}
          </DialogBody>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}
