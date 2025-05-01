import Navbar from '../components/Navbar'
import { ReactNode } from 'react'

export default function MoviesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
