/**
 * Example component demonstrating the use of both the Toast Provider and Entity Viewer Modal.
 * This file serves as a reference for how to use these app-wide features.
 *
 * To use this example, import it into a page or route.
 */

import { Button, Stack, VStack, Text } from '@chakra-ui/react'
import { toaster } from '../components/ui/toaster'
import { useEntityModal } from '../providers/EntityViewerModalProvider'
import { SalvageUnionReference } from 'salvageunion-reference'

export function ToastAndModalExample() {
  const { openEntityModal } = useEntityModal()

  // Get a sample ability for demonstration
  const sampleAbility = SalvageUnionReference.Abilities.all()[0]

  const handleShowToast = () => {
    toaster.create({
      title: 'Toast Example',
      description: 'This is a simple toast notification!',
      type: 'info',
    })
  }

  const handleShowSuccessToast = () => {
    toaster.success({
      title: 'Success!',
      description: 'Operation completed successfully.',
    })
  }

  const handleShowErrorToast = () => {
    toaster.error({
      title: 'Error',
      description: 'Something went wrong.',
    })
  }

  const handleShowToastWithAction = () => {
    toaster.create({
      title: 'Item Deleted',
      description: 'The item has been removed.',
      type: 'warning',
      action: {
        label: 'Undo',
        onClick: () => {
          toaster.success({ title: 'Undo successful!' })
        },
      },
    })
  }

  const handleOpenEntityModal = () => {
    if (sampleAbility) {
      openEntityModal('abilities', sampleAbility.id)
      toaster.info({ title: 'Opening entity viewer...' })
    }
  }

  const handlePromiseToast = () => {
    const promise = new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 2000)
    })

    toaster.promise(promise, {
      loading: { title: 'Loading data...' },
      success: { title: 'Data loaded successfully!' },
      error: { title: 'Failed to load data' },
    })
  }

  const handleDismissAll = () => {
    toaster.dismiss()
  }

  return (
    <VStack gap={6} alignItems="stretch" p={6} maxW="600px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold">
        Toast & Modal Examples
      </Text>

      <Stack gap={3}>
        <Text fontSize="lg" fontWeight="semibold">
          Toast Examples
        </Text>

        <Button onClick={handleShowToast} colorPalette="blue">
          Show Info Toast
        </Button>

        <Button onClick={handleShowSuccessToast} colorPalette="green">
          Show Success Toast
        </Button>

        <Button onClick={handleShowErrorToast} colorPalette="red">
          Show Error Toast
        </Button>

        <Button onClick={handleShowToastWithAction} colorPalette="orange">
          Show Toast with Action
        </Button>

        <Button onClick={handlePromiseToast} colorPalette="purple">
          Show Promise Toast
        </Button>

        <Button onClick={handleDismissAll} variant="outline">
          Dismiss All Toasts
        </Button>
      </Stack>

      <Stack gap={3}>
        <Text fontSize="lg" fontWeight="semibold">
          Entity Modal Example
        </Text>

        <Button onClick={handleOpenEntityModal} colorPalette="teal">
          Open Entity Viewer Modal
          {sampleAbility && ` (${sampleAbility.name})`}
        </Button>
      </Stack>

      <Stack gap={2} p={4} bg="su.lightBlue" borderRadius="md">
        <Text fontSize="sm" fontWeight="semibold">
          Usage Notes:
        </Text>
        <Text fontSize="xs">
          • Toasts appear in the bottom-right corner
          <br />
          • Multiple toasts stack vertically
          <br />
          • Toasts auto-dismiss after a few seconds
          <br />
          • Entity modal displays full entity details
          <br />• Both features work anywhere in the app
        </Text>
      </Stack>
    </VStack>
  )
}

