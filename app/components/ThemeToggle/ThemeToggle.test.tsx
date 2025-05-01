import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { useTheme } from 'next-themes'
import ThemeToggle from './index'

// Mock do next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn()
}))

// Mock dos ícones do lucide-react
vi.mock('lucide-react', () => ({
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  Moon: () => <div data-testid="moon-icon">Moon</div>
}))

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset do estado mounted
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render after mounting with light theme', async () => {
    // Mock useTheme para tema claro
    ;(useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme
    })

    render(<ThemeToggle />)

    // Simular montagem do componente
    await act(async () => {
      vi.runAllTimers()
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument()
  })

  it('should render after mounting with dark theme', async () => {
    // Mock useTheme para tema escuro
    ;(useTheme as Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme
    })

    render(<ThemeToggle />)

    // Simular montagem do componente
    await act(async () => {
      vi.runAllTimers()
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument()
  })

  it('should toggle theme from light to dark when clicked', async () => {
    // Mock useTheme para tema claro
    ;(useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme
    })

    render(<ThemeToggle />)

    // Simular montagem do componente
    await act(async () => {
      vi.runAllTimers()
    })

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('should toggle theme from dark to light when clicked', async () => {
    // Mock useTheme para tema escuro
    ;(useTheme as Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme
    })

    render(<ThemeToggle />)

    // Simular montagem do componente
    await act(async () => {
      vi.runAllTimers()
    })

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('should have correct styles', async () => {
    ;(useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme
    })

    render(<ThemeToggle />)

    // Simular montagem do componente
    await act(async () => {
      vi.runAllTimers()
    })

    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'p-2',
      'text-sm',
      'rounded',
      'bg-gray-200',
      'dark:bg-gray-700',
      'dark:text-white',
      'text-gray-800',
      'hover:bg-gray-300',
      'dark:hover:bg-gray-600'
    )
  })

  it('should handle undefined theme gracefully', async () => {
    // Mock useTheme sem tema definido
    ;(useTheme as Mock).mockReturnValue({
      theme: undefined,
      setTheme: mockSetTheme
    })

    render(<ThemeToggle />)

    // Simular montagem do componente
    await act(async () => {
      vi.runAllTimers()
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    // Assumindo que undefined theme mostra o ícone da lua (comportamento padrão)
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })
})