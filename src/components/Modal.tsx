import type { ReactNode } from 'react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogBackdrop,
  DialogCloseTrigger,
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
  backgroundColor = '#6b8e7f',
}: ModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <DialogBackdrop />
      <DialogContent maxW="4xl" maxH="90vh" bg={backgroundColor} borderRadius="lg">
        <DialogHeader
          bg={backgroundColor}
          borderBottomWidth="4px"
          borderBottomColor="su.black"
          px={6}
          py={4}
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
    </DialogRoot>
  )
}
