import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadImage, deleteImage, updateEntityImage } from '../lib/api/storage'
import { toaster } from '../components/ui/toaster'

interface UseImageUploadOptions {
  entityType: 'pilots' | 'mechs'
  entityId: string
  getCurrentImageUrl: () => string | null | undefined
  queryKey: unknown[]
}

export function useImageUpload({
  entityType,
  entityId,
  getCurrentImageUrl,
  queryKey,
}: UseImageUploadOptions) {
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Upload the new image
      const newImageUrl = await uploadImage(file, entityType, entityId)

      // Delete the old image if it exists
      const currentImageUrl = getCurrentImageUrl()
      if (currentImageUrl) {
        try {
          await deleteImage(currentImageUrl)
        } catch (error) {
          // Log but don't fail if old image deletion fails
          console.warn('Failed to delete old image:', error)
        }
      }

      // Update the entity with the new image URL
      await updateEntityImage(entityType, entityId, newImageUrl)

      return newImageUrl
    },
    onSuccess: async (newImageUrl) => {
      // Immediately update the cache for instant UI feedback
      queryClient.setQueryData(queryKey, (oldData: unknown) => {
        if (!oldData || typeof oldData !== 'object') return oldData
        // Create a completely new object to ensure React detects the change
        return JSON.parse(JSON.stringify({ ...oldData, image_url: newImageUrl }))
      })

      // Then invalidate to ensure we refetch from server
      await queryClient.invalidateQueries({
        queryKey,
        refetchType: 'active',
      })

      toaster.create({
        title: 'Image uploaded successfully',
        type: 'success',
      })
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to upload image',
        description: error.message,
        type: 'error',
      })
    },
  })

  const removeMutation = useMutation({
    mutationFn: async () => {
      // Delete the image from storage
      const currentImageUrl = getCurrentImageUrl()
      if (currentImageUrl) {
        await deleteImage(currentImageUrl)
      }

      // Clear the entity's image_url field
      await updateEntityImage(entityType, entityId, null)
    },
    onSuccess: async () => {
      // Immediately update the cache for instant UI feedback
      queryClient.setQueryData(queryKey, (oldData: unknown) => {
        if (!oldData || typeof oldData !== 'object') return oldData
        // Create a completely new object to ensure React detects the change
        return JSON.parse(JSON.stringify({ ...oldData, image_url: null }))
      })

      // Then invalidate to ensure we refetch from server
      await queryClient.invalidateQueries({
        queryKey,
        refetchType: 'active',
      })

      toaster.create({
        title: 'Image removed successfully',
        type: 'success',
      })
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to remove image',
        description: error.message,
        type: 'error',
      })
    },
  })

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      await uploadMutation.mutateAsync(file)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await removeMutation.mutateAsync()
    } finally {
      setIsRemoving(false)
    }
  }

  return {
    handleUpload,
    handleRemove,
    isUploading,
    isRemoving,
  }
}
