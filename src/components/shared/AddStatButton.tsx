import { StatDisplay } from '../StatDisplay'

interface AddStatButtonProps {
  onClick: () => void
  disabled?: boolean
  label?: string
}

/**
 * Reusable "Add" button component using StatDisplay styling
 * Used consistently across inventory, cargo, abilities, systems, etc.
 */
export function AddStatButton({ onClick, disabled = false, label = 'Add' }: AddStatButtonProps) {
  return (
    <StatDisplay
      label={label}
      value="+"
      disabled={disabled}
      onClick={onClick}
      bg="su.brick"
      valueColor="su.white"
    />
  )
}
