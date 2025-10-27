import { Button, type ButtonProps } from '@chakra-ui/react'

interface NavigationLinkProps extends Omit<ButtonProps, 'onClick'> {
  /** Whether this link is currently active */
  isActive: boolean
  /** Click handler for navigation */
  onClick: () => void
  /** Link text */
  children: React.ReactNode
}

/**
 * Consistent navigation link component
 * Used across TopNavigation and DashboardNavigation for uniform styling
 */
export function NavigationLink({ isActive, onClick, children, ...props }: NavigationLinkProps) {
  return (
    <Button
      onClick={onClick}
      px={4}
      py={2}
      _hover={{ bg: 'su.lightOrange' }}
      bg={isActive ? 'su.lightBlue' : 'transparent'}
      borderBottomWidth={isActive ? '3px' : 0}
      borderBottomColor="su.orange"
      color="su.black"
      fontWeight={isActive ? 'semibold' : 'normal'}
      borderRadius="md"
      variant="ghost"
      h="auto"
      w={{ base: 'full', lg: 'auto' }}
      {...props}
    >
      {children}
    </Button>
  )
}
