import { SheetTextarea } from './SheetTextarea'
import { RoundedBox } from './RoundedBox'

interface NotesProps {
  notes: string
  onChange: (value: string) => void
  /** Disables the textarea input */
  disabled?: boolean
  /** Greys out the RoundedBox background (only for missing required data) */
  incomplete?: boolean
  backgroundColor?: string
  placeholder?: string
  h?: string | number
  flex?: string | number
  minH?: string | number
}

export function Notes({
  notes,
  onChange,
  placeholder,
  disabled = false,
  incomplete = false,
  backgroundColor = 'bg.builder',
  h,
  flex,
  minH,
}: NotesProps) {
  return (
    <RoundedBox
      title="notes"
      bg={backgroundColor}
      disabled={incomplete}
      h={h ?? 'full'}
      flex={flex}
      minH={minH}
    >
      <SheetTextarea
        value={notes}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        height="full"
      />
    </RoundedBox>
  )
}
