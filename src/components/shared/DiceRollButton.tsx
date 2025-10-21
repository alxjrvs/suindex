import { IconButton } from '@chakra-ui/react'

interface DiceRollButtonProps {
  onClick: () => void
  disabled?: boolean
  ariaLabel: string
  title: string
}

export function DiceRollButton({ onClick, disabled, ariaLabel, title }: DiceRollButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      color="su.inputBg"
      _hover={{ color: 'su.white', borderColor: 'su.white' }}
      _disabled={{ opacity: 0.3, cursor: 'not-allowed' }}
      borderWidth="2px"
      borderColor="su.inputBg"
      borderRadius="lg"
      p={1}
      aria-label={ariaLabel}
      title={title}
      variant="outline"
      bg="transparent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
        fill="currentColor"
      >
        <path d="M240-120q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm480 0q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM240-600q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm240 240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm240-240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
      </svg>
    </IconButton>
  )
}
