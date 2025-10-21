interface BuilderLayoutProps {
  children: React.ReactNode
}

export function BuilderLayout({ children }: BuilderLayoutProps) {
  return (
    <div className="bg-[var(--color-su-green)] min-h-screen px-6 pt-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  )
}

