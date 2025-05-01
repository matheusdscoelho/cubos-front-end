'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useMovie } from '@/lib/queries'

export default function MovieDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const movieId = String(id)

  const { data: movie, isLoading, isError } = useMovie(movieId)

  if (isLoading) {
    return <p className="p-6 text-center text-lg animate-pulse">Carregando filme...</p>
  }

  if (isError || !movie) {
    router.replace('/not-found')
    return null
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 text-white px-6 py-12 flex flex-col items-center">
      <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl bg-zinc-900">
        <div className="relative w-full h-[400px]">
          <Image
            src={
              movie.image ||
              `https://placehold.co/800x400.png?text=${encodeURIComponent(movie.title)}`
            }
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {movie.title}
            </h1>

            <Link
              href={`/movies/${movie.id}/edit`}
              className="px-3 py-1.5 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition font-medium text-sm"
            >
              ✏️ Editar
            </Link>
          </div>

          <p className="text-sm text-zinc-400 mb-2">
            Lançamento: {new Date(movie.releaseDate).toLocaleDateString()}
          </p>

          <p className="text-zinc-200 mb-4 leading-relaxed">{movie.description}</p>

          <div className="text-sm text-zinc-400">
            <span>Duração: <strong>{movie.duration ?? '-'}</strong> min</span>
            <span className="mx-2">|</span>
            <span>Orçamento: <strong>R$ {movie.budget?.toLocaleString('pt-BR') ?? '-'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}
