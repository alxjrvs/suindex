interface FooterProps {
  variant?: 'landing' | 'inner' | 'nav'
}

export default function Footer({ variant = 'inner' }: FooterProps) {
  if (variant === 'nav') {
    return (
      <footer className="bg-[var(--color-su-white)] border-t border-[var(--color-su-light-blue)] py-3">
        <div className="px-4 text-[var(--color-su-black)] text-xs flex flex-col items-center gap-3">
          <div className="text-center">
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
              .
            </p>
            <p>
              Salvage Union and the "Powered by Salvage" logo are used with permission of Leyline
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
          <img
            src="/Powered_by_Salvage_Black.webp"
            alt="Powered by Salvage"
            className="h-12 w-auto"
          />
        </div>
      </footer>
    )
  }

  if (variant === 'landing') {
    return (
      <footer className="bg-transparent py-3 mt-auto">
        <div className="max-w-7xl mx-auto text-[var(--color-su-black)] text-xs flex items-center justify-center gap-4">
          <div className="text-center">
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
              .
            </p>
            <p>
              Salvage Union and the "Powered by Salvage" logo are used with permission of Leyline
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
          <img
            src="/Powered_by_Salvage_Black.webp"
            alt="Powered by Salvage"
            className="h-12 w-auto"
          />
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-[var(--color-su-green)] border-t border-[var(--color-su-black)] py-3 mt-auto">
      <div className="max-w-7xl mx-auto text-[var(--color-su-black)] text-xs flex items-center justify-center gap-4">
        <div className="text-center">
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
            .
          </p>
          <p>
            Salvage Union and the "Powered by Salvage" logo are used with permission of Leyline
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
        <img
          src="/Powered_by_Salvage_Black.webp"
          alt="Powered by Salvage"
          className="h-12 w-auto"
        />
      </div>
    </footer>
  )
}
