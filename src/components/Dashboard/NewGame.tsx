import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { supabase } from '../../lib/supabase'
import type { TablesInsert } from '../../types/database'

interface GameFormData {
  name: string
  description: string
}

export function NewGame() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GameFormData>()

  const onSubmit = async (data: GameFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create the game
      const gameData: TablesInsert<'games'> = {
        name: data.name,
        description: data.description || null,
        created_by: user.id,
      }

      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert(gameData)
        .select()
        .single()

      if (gameError) throw gameError

      // The trigger will automatically add the creator as a mediator
      // No need to manually create the game_member relationship

      // Navigate to the game show page
      navigate(`/dashboard/games/${game.id}`)
    } catch (err) {
      console.error('Error creating game:', err)
      setError(err instanceof Error ? err.message : 'Failed to create game')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-su-black)] mb-2">Create New Game</h1>
        <p className="text-[var(--color-su-brick)]">Start a new Salvage Union game session</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[var(--color-su-black)] mb-2"
          >
            Game Name *
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Game name is required' })}
            className="w-full px-4 py-2 border border-[var(--color-su-light-blue)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-su-brick)]"
            placeholder="Enter game name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[var(--color-su-black)] mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={6}
            className="w-full px-4 py-2 border border-[var(--color-su-light-blue)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-su-brick)]"
            placeholder="Enter game description (optional)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[var(--color-su-brick)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-3 px-6 rounded-lg transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Game'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            disabled={isSubmitting}
            className="flex-1 bg-[var(--color-su-light-blue)] hover:opacity-90 text-[var(--color-su-black)] font-bold py-3 px-6 rounded-lg transition-opacity disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
