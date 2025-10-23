import { Link as RouterLink } from 'react-router-dom'
import { Button } from '@chakra-ui/react'

interface LinkButtonProps {
  to: string
  label: string
}

export function LinkButton({ to, label }: LinkButtonProps) {
  return (
    <Button
      asChild
      px={3}
      py={2}
      bg="white"
      color="black"
      borderWidth="2px"
      borderColor="black"
      borderRadius="lg"
      fontFamily="mono"
      fontSize="sm"
      fontWeight="semibold"
      _hover={{ bg: 'gray.100' }}
    >
      <RouterLink to={to}>{label}</RouterLink>
    </Button>
  )
}
