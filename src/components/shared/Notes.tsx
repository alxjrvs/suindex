import { FormTextarea } from './FormTextarea'
import { RoundedBox } from './RoundedBox'

interface NotesProps {
  notes: string
  onChange: (value: string) => void
  disabled?: boolean
  backgroundColor?: string
  borderWidth?: 4 | 8
  placeholder?: string
  height?: string
}

export function Notes({
  notes,
  onChange,
  disabled = false,
  backgroundColor = 'bg.builder',
  height = '96',
}: NotesProps) {
  return (
    <RoundedBox title="notes" bg={backgroundColor} borderColor={backgroundColor}>
      <FormTextarea
        value={notes}
        onChange={onChange}
        disabled={disabled}
        placeholder={'Add notes...'}
        height={height}
      />
    </RoundedBox>
  )
}
