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
  backgroundColor = 'bg.builder',
}: ModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <DialogBackdrop />
      <DialogContent
        maxW="4xl"
        maxH="90vh"
        bg={backgroundColor}
        borderWidth="8px"
        borderColor={backgroundColor}
        borderRadius="24px"
        shadow="lg"
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={1400}
      >
        <DialogHeader
          bg={backgroundColor}
          borderBottomWidth="4px"
          borderBottomColor="su.black"
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
    </DialogRoot>
  )
}
