'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ThemeToggle from '../components/ThemeToggle'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/movies')
    }
  }, [router])

  return (
    <div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {children}
    </div>
  )
}

export default Layout
