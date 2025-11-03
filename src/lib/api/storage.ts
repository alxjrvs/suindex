import { supabase } from '../supabase'

const BUCKET_NAME = 'user-images'

/**
 * Upload an image file to Supabase storage
 * Files are stored in user-specific folders: {userId}/{entityType}/{entityId}/{filename}
 */
export async function uploadImage(
  file: File,
  entityType: 'pilots' | 'mechs',
  entityId: string
): Promise<string> {
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to upload images')
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.')
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB')
  }

  // Generate file path: {userId}/{entityType}/{entityId}/{timestamp}-{filename}
  const timestamp = Date.now()
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `${user.id}/${entityType}/${entityId}/${timestamp}-${sanitizedFilename}`

  // Upload file to storage
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false, // Don't overwrite existing files
  })

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL for the uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

  return publicUrl
}

/**
 * Delete an image from Supabase storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  // Extract the file path from the URL
  // URL format: https://{project}.supabase.co/storage/v1/object/public/user-images/{path}
  const urlParts = imageUrl.split(`/storage/v1/object/public/${BUCKET_NAME}/`)
  if (urlParts.length !== 2) {
    throw new Error('Invalid image URL format')
  }

  const filePath = urlParts[1]

  // Delete the file
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

/**
 * Update entity with new image URL
 */
export async function updateEntityImage(
  entityType: 'pilots' | 'mechs',
  entityId: string,
  imageUrl: string | null
): Promise<void> {
  const { error } = await supabase
    .from(entityType)
    .update({ image_url: imageUrl })
    .eq('id', entityId)

  if (error) {
    throw new Error(`Failed to update ${entityType} image: ${error.message}`)
  }
}
