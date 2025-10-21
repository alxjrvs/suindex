import { useState } from 'react'
import Modal from '../Modal'

interface CargoModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (amount: number, description: string) => void
}

export function CargoModal({ isOpen, onClose, onAdd }: CargoModalProps) {
  const [description, setDescription] = useState('')

  const isValid = description.trim() !== ''

  const handleSubmit = () => {
    if (isValid) {
      onAdd(1, description) // Always use 1 for amount since we're not tracking it
      setDescription('')
      onClose()
    }
  }

  const handleClose = () => {
    setDescription('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Cargo" backgroundColor="#c97d9e">
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-bold text-[#e8e5d8] mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter cargo description..."
            className="w-full p-1.5 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold"
          />
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={handleClose}
            className="bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-1.5 rounded-lg font-bold hover:bg-[var(--color-su-black)] transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-3 py-1.5 rounded-lg font-bold hover:bg-[var(--color-su-light-orange)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  )
}
