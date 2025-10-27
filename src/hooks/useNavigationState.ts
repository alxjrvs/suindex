import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { signOut } from '../lib/api'

/**
 * Shared navigation state and handlers
 * Consolidates common navigation logic used across TopNavigation and DashboardNavigation
 */
export function useNavigationState() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path)
      setIsOpen(false)
    },
    [navigate]
  )

  const handleSignOut = useCallback(async () => {
    try {
      setSigningOut(true)
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setSigningOut(false)
    }
  }, [])

  const isActive = useCallback(
    (path: string, exact = false) => {
      if (exact) {
        return location.pathname === path
      }
      return location.pathname.startsWith(path)
    },
    [location.pathname]
  )

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return {
    isOpen,
    signingOut,
    handleNavigate,
    handleSignOut,
    isActive,
    toggleMenu,
    location,
  }
}
