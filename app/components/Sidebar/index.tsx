import Link from "next/link"
import ThemeToggle from "../ThemeToggle"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

interface NavLink {
  href: string;
  label: string;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  navLinks: NavLink[];
}

export default function Sidebar({ open, onClose, onLogout, navLinks }: SidebarProps) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" data-testid="sidebar-overlay">
      <div 
        className="fixed left-0 top-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-6 z-50 flex flex-col gap-4"
        data-testid="sidebar-container"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Menu</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 dark:text-white"
            data-testid="sidebar-close-button"
          >
            <X size={24} />
          </button>
        </div>

        {navLinks.map((link: NavLink) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            data-testid={`nav-link-${link.label.toLowerCase()}`}
            className={`text-sm font-medium px-3 py-2 rounded ${
              pathname === link.href
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 dark:text-gray-300 hover:underline'
            }`}
          >
            {link.label}
          </Link>
        ))}

        <button
          onClick={() => {
            onLogout()
            onClose()
          }}
          data-testid="logout-button"
          className="text-sm font-medium px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Sair
        </button>

        <ThemeToggle />
      </div>
    </div>
  )
}