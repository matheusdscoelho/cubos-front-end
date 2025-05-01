'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMovies } from '@/lib/queries';
import { Movie } from '@/types';
import DebouncedInput from '@/app/components/DebouncedInput';
import Spinner from '../components/Spinner';

const ITEMS_PER_PAGE = 9;

export default function MoviesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [durationMin, setDurationMin] = useState('');
  const [durationMax, setDurationMax] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [minBudget, setMinBudget] = useState('');

  const { data, isLoading } = useMovies({
    search,
    durationMin,
    durationMax,
    dateStart,
    dateEnd,
    minBudget,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const movies = data?.movies ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        🎬 Catálogo de Filmes
      </h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <DebouncedInput
          type="text"
          placeholder="Buscar por título..."
          className="w-full md:w-1/2 px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
          value={search}
          onChange={setSearch}
          delay={500}
        />

        <div className="flex gap-2 justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
          >
            {showFilters ? 'Fechar filtros' : 'Filtros'}
          </button>
          <Link
            href="/movies/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Novo Filme
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div>
            <label className="block text-sm mb-1">Duração mínima</label>
            <DebouncedInput
              type="number"
              value={durationMin}
              onChange={setDurationMin}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Duração máxima</label>
            <DebouncedInput
              type="number"
              value={durationMax}
              onChange={setDurationMax}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Orçamento mínimo</label>
            <DebouncedInput
              type="number"
              value={minBudget}
              onChange={setMinBudget}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Data inicial</label>
            <DebouncedInput
              type="date"
              value={dateStart}
              onChange={setDateStart}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Data final</label>
            <DebouncedInput
              type="date"
              value={dateEnd}
              onChange={setDateEnd}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size={96} />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie: Movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer">
                <Image
                  width={400}
                  height={200}
                  src={
                    movie.image ||
                    `https://placehold.co/400x200.png?text=${encodeURIComponent(movie.title)}`
                  }
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-3">
                    {movie.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-4 py-2 rounded-full font-medium border transition-all duration-200 ${
              p === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
