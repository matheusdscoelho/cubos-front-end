'use client'

import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Página não encontrada</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        A página que você está tentando acessar não existe ou foi removida.
      </p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Voltar para a página inicial
      </Link>
    </div>
  )
}
