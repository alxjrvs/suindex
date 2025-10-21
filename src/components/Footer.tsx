interface FooterProps {
  variant?: 'landing' | 'inner'
}

export default function Footer({ variant = 'inner' }: FooterProps) {
  if (variant === 'landing') {
    return (
      <footer className="bg-[var(--color-su-green)] py-3 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-[var(--color-su-black)] text-xs">
          <p>
            Salvage Union is copyrighted by{' '}
            <a
              href="https://leyline.press"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-su-brick)]"
            >
              Leyline Press
            </a>
            . Salvage Union and the "Powered by Salvage" logo are used with permission of Leyline
            Press, under the{' '}
            <a
              href="https://leyline.press/pages/salvage-union-open-game-licence-1-0b"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-su-brick)]"
            >
              Salvage Union Open Game Licence 1.0b
            </a>
            .
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-[var(--color-su-green)] border-t-4 border-[var(--color-su-black)] py-3 mt-auto">
      <div className="max-w-7xl mx-auto text-center text-[var(--color-su-black)] text-xs">
        <p>
          Salvage Union is copyrighted by{' '}
          <a
            href="https://leyline.press"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-su-brick)]"
          >
            Leyline Press
          </a>
          . Salvage Union and the "Powered by Salvage" logo are used with permission of Leyline
          Press, under the{' '}
          <a
            href="https://leyline.press/pages/salvage-union-open-game-licence-1-0b"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-su-brick)]"
          >
            Salvage Union Open Game Licence 1.0b
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
