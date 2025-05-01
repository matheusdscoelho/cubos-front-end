export async function api(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')
  
    const headers: HeadersInit = {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
    }
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers,
    })
  
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error?.error || 'Erro na requisição')
    }
  
    return res.json()
  }
  