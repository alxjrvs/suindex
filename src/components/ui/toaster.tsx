'use client'

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
  gap: 2,
  offsets: {
    bottom: '1rem',
    right: '1rem',
    left: '1rem',
    top: '1rem',
  },
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root width="auto" minWidth="300px" maxWidth="500px">
            {toast.type === 'loading' && <Spinner size="sm" color="su.orange" />}
            <Stack gap="1" flex="1" maxWidth="100%" direction="column">
              {toast.title && (
                <Toast.Title whiteSpace="normal" wordBreak="break-word">
                  {toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description whiteSpace="normal" wordBreak="break-word">
                  {toast.description}
                </Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger asChild>
                <button>{toast.action.label}</button>
              </Toast.ActionTrigger>
            )}
            {toast.meta?.closable !== false && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
