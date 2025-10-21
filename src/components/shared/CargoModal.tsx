import { useState } from 'react'
import Modal from '../Modal'

interface CargoModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (amount: number, description: string) => void
  maxCargo?: number // Optional - if provided, shows amount input and tracking
  currentCargo?: number // Optional - if provided, shows available cargo
  backgroundColor?: string // For different builder colors
}

export function CargoModal({
  isOpen,
  onClose,
  onAdd,
  maxCargo,
  currentCargo = 0,
  backgroundColor,
}: CargoModalProps) {
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState('')

  const hasCargoTracking = maxCargo !== undefined
  const availableCargo = hasCargoTracking ? maxCargo - currentCargo : 0
  const isValid = hasCargoTracking
    ? amount > 0 && amount <= availableCargo && description.trim() !== ''
    : description.trim() !== ''

  const handleSubmit = () => {
    if (isValid) {
      onAdd(hasCargoTracking ? amount : 1, description)
      setAmount(0)
      setDescription('')
      onClose()
    }
  }

  const handleClose = () => {
    setAmount(0)
    setDescription('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Cargo"
      backgroundColor={backgroundColor}
    >
      <div className="space-y-2">
        {hasCargoTracking ? (
          <div className="flex gap-2 items-end">
            <div className="w-24">
              <label className="block text-xs font-bold text-[#e8e5d8] mb-1">Amount</label>
              <input
                type="number"
                min="0"
                max={availableCargo}
                value={amount}
                onChange={(e) =>
                  setAmount(Math.max(0, Math.min(availableCargo, parseInt(e.target.value) || 0)))
                }
                className="w-full p-1.5 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold text-center"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#e8e5d8] mb-1">
                Description (Available: {availableCargo})
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter cargo description..."
                className="w-full p-1.5 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold"
              />
            </div>
          </div>
        ) : (
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
        )}

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
            {hasCargoTracking ? 'Add Cargo' : 'Add'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
