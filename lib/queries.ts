import { useQuery, useMutation } from '@tanstack/react-query'
import api from './axios'
import { MovieFilters } from '@/types';

// 1. Registrar usuário
export const useRegister = () =>
  useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      api.post('/auth/register', data),
  })

// 2. Login
export const useLogin = () =>
  useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post('/auth/login', data),
  })

// 3. Listar filmes
export const useMovies = (filters: MovieFilters) =>
    useQuery({
      queryKey: ['movies', filters],
      queryFn: async () => {
        const params = new URLSearchParams()
  
        if (filters.search) params.append('search', filters.search)
        if (filters.durationMin) params.append('durationMin', filters.durationMin)
        if (filters.durationMax) params.append('durationMax', filters.durationMax)
        if (filters.dateStart) params.append('dateStart', filters.dateStart)
        if (filters.dateEnd) params.append('dateEnd', filters.dateEnd)
        if (filters.minBudget) params.append('minBudget', filters.minBudget)
        if (filters.maxBudget) params.append('maxBudget', filters.maxBudget)
        params.append('page', String(filters.page ?? 1))
        params.append('limit', String(filters.limit ?? 9))
  
        const res = await api.get(`api/movies?${params.toString()}`)
        return res.data
      },
    })

// 4. Buscar filme por ID
export const useMovie = (id: string) =>
  useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const res = await api.get(`api/movies/${id}`)
      return res.data
    },
    enabled: !!id,
  })

// 5. Editar filme
export const useEditMovie = () =>
  useMutation({
    mutationFn: (payload: { id: string; data: FormData }) =>
      api.put(`api/movies/${payload.id}`, payload.data),
  })


// 6. Criar filme
export const useCreateMovie = () =>
  useMutation({
    mutationFn: (formData: FormData) =>
      api.post('api/movies', formData),
  })