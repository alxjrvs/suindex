import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { SchemaInfo } from '../types/schema'
import Footer from './Footer'

interface ReferenceNavigationProps {
  schemas: SchemaInfo[]
}

export default function ReferenceNavigation({ schemas }: ReferenceNavigationProps) {
  const { schemaId } = useParams<{ schemaId: string }>()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[var(--color-su-orange)] text-[var(--color-su-white)] p-2 rounded-lg"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={`fixed md:static top-0 left-0 h-screen md:h-auto w-64 bg-[var(--color-su-white)] shadow-lg overflow-y-auto border-r border-[var(--color-su-light-blue)] z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1">
          <button
            onClick={() => handleNavigate('/')}
            className="w-full text-left block p-4 border-b border-[var(--color-su-light-blue)] hover:bg-[var(--color-su-light-orange)] transition-colors bg-transparent border-none cursor-pointer"
          >
            <h1 className="text-xl font-bold text-[var(--color-su-black)]">Salvage Union</h1>
            <p className="text-sm text-[var(--color-su-brick)]">Index</p>
          </button>
          <ul className="py-2">
            {schemas.map((schema) => (
              <li key={schema.id}>
                <button
                  onClick={() => handleNavigate(`/reference/schema/${schema.id}`)}
                  className={`w-full text-left block px-4 py-3 hover:bg-[var(--color-su-light-orange)] transition-colors bg-transparent border-none cursor-pointer ${
                    schemaId === schema.id
                      ? 'bg-[var(--color-su-light-blue)] border-l-4 border-[var(--color-su-orange)] text-[var(--color-su-black)] font-medium'
                      : 'text-[var(--color-su-black)]'
                  }`}
                >
                  <div>{schema.title.replace('Salvage Union ', '')}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto">
          <Footer variant="nav" />
        </div>
      </nav>
    </>
  )
}
