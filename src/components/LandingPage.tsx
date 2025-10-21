import { Link } from 'react-router-dom'
import Footer from './Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-su-green)] p-6">
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
            This is a web app for viewing and exploring Salvage Union game data. Search through
            abilities, equipment, mechs, crawlers, and more. Build your pilot, mech, or crawler with
            interactive builders that track stats and requirements.
          </p>
          <p className="text-lg text-[var(--color-su-black)]">
            All data comes from the official Salvage Union reference, so it's always up to date.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Browse Data */}
          <div className="bg-[var(--color-su-white)] rounded-lg shadow-lg p-6 border-4 border-[var(--color-su-black)]">
            <h3 className="text-2xl font-bold text-[var(--color-su-brick)] mb-3">Browse Data</h3>
            <ul className="space-y-2 text-[var(--color-su-black)]">
              <li className="flex items-start">
                <span className="text-[var(--color-su-orange)] mr-2">▸</span>
                <span>Search and filter through all game content</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-su-orange)] mr-2">▸</span>
                <span>View detailed stats and descriptions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-su-orange)] mr-2">▸</span>
                <span>Sort by any field</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-su-orange)] mr-2">▸</span>
                <span>Filter by tech level, type, or any attribute</span>
              </li>
            </ul>
          </div>

          {/* Build Characters */}
          <div className="bg-[var(--color-su-white)] rounded-lg shadow-lg p-6 border-4 border-[var(--color-su-black)]">
            <h3 className="text-2xl font-bold text-[var(--color-su-brick)] mb-3">
              Build Characters
            </h3>
            <ul className="space-y-2 text-[var(--color-su-black)]">
              <li className="flex items-start">
                <span className="text-[var(--color-su-orange)] mr-2">▸</span>
                <span>Create pilots with class abilities and equipment</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-su-orange)] mr-2">▸</span>
                <span>Build mechs with systems and modules</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-su-orange)] mr-2">▸</span>
                <span>Design crawlers with bays and cargo</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-su-orange)] mr-2">▸</span>
                <span>Track stats, slots, and requirements automatically</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-[var(--color-su-white)] rounded-lg shadow-lg p-8 border-4 border-[var(--color-su-black)]">
          <h2 className="text-3xl font-bold text-[var(--color-su-brick)] mb-6">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/index/schema/abilities"
              className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-6 py-4 rounded-lg font-bold text-center hover:bg-[var(--color-su-light-orange)] transition-colors text-lg"
            >
              Browse Data
            </Link>
            <Link
              to="/index/pilot-builder"
              className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-6 py-4 rounded-lg font-bold text-center hover:bg-[var(--color-su-light-orange)] transition-colors text-lg"
            >
              Build a Pilot
            </Link>
            <Link
              to="/index/mech-builder"
              className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-6 py-4 rounded-lg font-bold text-center hover:bg-[var(--color-su-light-orange)] transition-colors text-lg"
            >
              Build a Mech
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
