'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'
import Sidebar from '../Sidebar'

const navLinks = [
  { label: 'Filmes', href: '/movies' },
  { label: '+ Novo', href: '/movies/new' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            🎬 Cubos Filmes
          </h1>

          <nav className="hidden md:flex gap-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-3 py-1 rounded ${
                  pathname === link.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:underline'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="text-sm font-medium px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Sair
            </button>

            <ThemeToggle />
          </nav>

          <button
            className="md:hidden text-gray-700 dark:text-white"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      <Sidebar
        open={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        navLinks={navLinks}
      />
    </>
  )
}
