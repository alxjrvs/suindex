import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Footer from '../Footer'
import type { User } from '@supabase/supabase-js'

interface DashboardNavigationProps {
  user: User
}

export function DashboardNavigation({ user }: DashboardNavigationProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setSigningOut(false)
    }
  }

  const isActive = (path: string) => location.pathname === path

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
            <p className="text-sm text-[var(--color-su-brick)]">Dashboard</p>
          </button>

          <ul className="py-2">
            <li>
              <button
                onClick={() => handleNavigate('/dashboard')}
                className={`w-full text-left block px-4 py-3 hover:bg-[var(--color-su-light-orange)] transition-colors bg-transparent border-none cursor-pointer ${
                  isActive('/dashboard')
                    ? 'bg-[var(--color-su-light-blue)] border-l-4 border-[var(--color-su-orange)] text-[var(--color-su-black)] font-medium'
                    : 'text-[var(--color-su-black)]'
                }`}
              >
                Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('/dashboard/crawlers')}
                className={`w-full text-left block px-4 py-3 hover:bg-[var(--color-su-light-orange)] transition-colors bg-transparent border-none cursor-pointer ${
                  isActive('/dashboard/crawlers')
                    ? 'bg-[var(--color-su-light-blue)] border-l-4 border-[var(--color-su-orange)] text-[var(--color-su-black)] font-medium'
                    : 'text-[var(--color-su-black)]'
                }`}
              >
                Crawlers
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('/dashboard/pilots')}
                className={`w-full text-left block px-4 py-3 hover:bg-[var(--color-su-light-orange)] transition-colors bg-transparent border-none cursor-pointer ${
                  isActive('/dashboard/pilots')
                    ? 'bg-[var(--color-su-light-blue)] border-l-4 border-[var(--color-su-orange)] text-[var(--color-su-black)] font-medium'
                    : 'text-[var(--color-su-black)]'
                }`}
              >
                Pilots
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('/dashboard/mechs')}
                className={`w-full text-left block px-4 py-3 hover:bg-[var(--color-su-light-orange)] transition-colors bg-transparent border-none cursor-pointer ${
                  isActive('/dashboard/mechs')
                    ? 'bg-[var(--color-su-light-blue)] border-l-4 border-[var(--color-su-orange)] text-[var(--color-su-black)] font-medium'
                    : 'text-[var(--color-su-black)]'
                }`}
              >
                Mechs
              </button>
            </li>
          </ul>
        </div>
        <div className="mt-auto">
          {/* User Info & Sign Out */}
          <div className="p-4 border-t border-[var(--color-su-light-blue)] bg-[var(--color-su-light-orange)]">
            <div className="text-sm text-[var(--color-su-black)] font-medium mb-2">
              {user.user_metadata?.full_name || user.email || 'User'}
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full text-left text-sm text-[var(--color-su-brick)] hover:text-[var(--color-su-orange)] transition-colors disabled:opacity-50 bg-transparent border-none cursor-pointer"
            >
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
          <Footer variant="nav" />
        </div>
      </nav>
    </>
  )
}
