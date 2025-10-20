interface DigestedRollTable {
  order: number
  name: string
  description: string
  key: string
}

interface RollTableDisplayProps {
  rollTable: Record<string, string>
  showCommand?: boolean
}

function digestRollTable(tables: Record<string, string>): DigestedRollTable[] {
  const sorted = Object.keys(tables)
    .sort((a, b) => {
      const aNum = parseInt(a.split('-')[0])
      const bNum = parseInt(b.split('-')[0])
      return aNum - bNum
    })
    .reverse()

  return sorted.map((key, order) => {
    const fullDescription = tables[key]
    const name = fullDescription.split(':')[0]
    const description = fullDescription.replace(`${name}:`, '').trim()

    return {
      order,
      name,
      description,
      key,
    }
  })
}

export function RollTableDisplay({ rollTable, showCommand = false }: RollTableDisplayProps) {
  const digestedTable = digestRollTable(rollTable)

  return (
    <div>
      {showCommand && (
        <div className="bg-[var(--color-su-black)] text-[var(--color-su-white)] font-bold uppercase text-center self-center p-2 mb-2">
          ROLL THE DIE:
        </div>
      )}
      {digestedTable.map(({ name, description, key }, index) => {
        if (key === 'type') return null
        const showTitle = name !== description
        const bgColor = index % 2 === 0 ? 'var(--color-su-light-orange)' : 'var(--color-su-white)'

        return (
          <div
            key={key + name + index}
            className="flex flex-row flex-wrap"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex-1 flex items-center justify-center self-center">
              <span className="text-xl font-bold text-[var(--color-su-black)] text-center">
                {key}
              </span>
            </div>
            <div className="flex-[4] flex flex-row flex-wrap py-1">
              <p className="text-[var(--color-su-black)]">
                {showTitle && <span className="font-bold">{name}: </span>}
                {description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
