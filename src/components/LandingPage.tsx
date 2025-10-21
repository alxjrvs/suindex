import { Link } from 'react-router-dom'
import Footer from './Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-su-light-blue)] px-6 pt-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-[var(--color-su-white)] rounded-lg shadow-lg p-8 mb-6 border-4 border-[var(--color-su-black)]">
          <h1 className="text-5xl font-bold text-[var(--color-su-black)] mb-4">
            Salvage Union Index
          </h1>
          <p className="text-xl text-[var(--color-su-black)] mb-6">
            Browse game data and build characters, mechs, and crawlers for Salvage Union.
          </p>
        </div>

        {/* What This Is */}
        <div className="bg-[var(--color-su-white)] rounded-lg shadow-lg p-8 mb-6 border-4 border-[var(--color-su-black)]">
          <h2 className="text-3xl font-bold text-[var(--color-su-brick)] mb-4">What This Is</h2>
          <p className="text-lg text-[var(--color-su-black)] mb-4">
            This is a web app for viewing and exploring{' '}
            <a
              href="https://leyline.press/collections/salvage-union"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-su-orange)] underline hover:text-[var(--color-su-brick)]"
            >
              Salvage Union
            </a>{' '}
            game data. Search through abilities, equipment, mechs, crawlers, and more. Build your
            pilot, mech, or crawler with interactive builders that track stats and requirements.
          </p>
          <p className="text-lg text-[var(--color-su-black)]">
            Salvage Union is a mech tabletop RPG published by{' '}
            <a
              href="https://leyline.press/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-su-orange)] underline hover:text-[var(--color-su-brick)]"
            >
              Leyline Press
            </a>
            . All data comes from the{' '}
            <a
              href="https://github.com/alxjrvs/salvageunion-reference"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-su-orange)] underline hover:text-[var(--color-su-brick)]"
            >
              unofficial Salvage Union Reference
            </a>
            .
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-[var(--color-su-white)] rounded-lg shadow-lg p-8 border-4 border-[var(--color-su-black)]">
          <h2 className="text-3xl font-bold text-[var(--color-su-brick)] mb-6">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard"
              className="bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-6 py-4 rounded-lg font-bold text-center hover:opacity-90 transition-opacity text-lg"
            >
              Dashboard
            </Link>
            <Link
              to="/builders/"
              className="bg-[var(--color-su-green)] text-[var(--color-su-white)] px-6 py-4 rounded-lg font-bold text-center hover:opacity-90 transition-opacity text-lg"
            >
              Playground
            </Link>
            <Link
              to="/reference/schema/abilities"
              className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-6 py-4 rounded-lg font-bold text-center hover:opacity-90 transition-opacity text-lg"
            >
              Rules Reference
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Footer variant="landing" />
      </div>
    </div>
  )
}
