interface DiceRollButtonProps {
  onClick: () => void
  disabled?: boolean
  ariaLabel: string
  title: string
}

export function DiceRollButton({ onClick, disabled, ariaLabel, title }: DiceRollButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-[#e8e5d8] hover:text-[var(--color-su-white)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-2 border-[#e8e5d8] hover:border-[var(--color-su-white)] rounded-lg p-1"
      aria-label={ariaLabel}
      title={title}
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
    </button>
  )
}

