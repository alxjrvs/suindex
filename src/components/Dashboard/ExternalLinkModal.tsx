import { useState } from 'react'
import Modal from '../Modal'

interface ExternalLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string, url: string) => void
}

export function ExternalLinkModal({ isOpen, onClose, onAdd }: ExternalLinkModalProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const isValid = name.trim() !== '' && url.trim() !== ''

  const handleSubmit = () => {
    if (isValid) {
      onAdd(name.trim(), url.trim())
      setName('')
      setUrl('')
      onClose()
    }
  }

  const handleClose = () => {
    setName('')
    setUrl('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add External Link">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Title
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter link title..."
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={handleClose}
            className="bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Link
          </button>
        </div>
      </div>
    </Modal>
  )
}

