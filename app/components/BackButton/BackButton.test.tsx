import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import BackButton from './index'

// Mock do next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

// Mock do ícone do lucide-react
vi.mock('lucide-react', () => ({
  LucideArrowLeft: () => <span data-testid="arrow-icon">←</span>
}))

describe('BackButton', () => {
  const mockBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as Mock).mockReturnValue({
      back: mockBack
    })
  })

  it('should render with default label', () => {
    render(<BackButton />)
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument()
    expect(screen.getByText('Voltar')).toBeInTheDocument()
    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument()
  })

  it('should render with custom label', () => {
    render(<BackButton label="Retornar" />)
    expect(screen.getByRole('button', { name: /retornar/i })).toBeInTheDocument()
    expect(screen.getByText('Retornar')).toBeInTheDocument()
  })

  it('should call router.back when clicked', () => {
    render(<BackButton />)
    const button = screen.getByRole('button', { name: /voltar/i })
    fireEvent.click(button)
    expect(mockBack).toHaveBeenCalledTimes(1)
  })

  it('should have correct styles', () => {
    render(<BackButton />)
    const button = screen.getByRole('button', { name: /voltar/i })
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'gap-2',
      'px-4',
      'py-2',
      'mb-10',
      'bg-gray-300',
      'hover:bg-gray-400',
      'dark:bg-gray-700',
      'dark:hover:bg-gray-600',
      'text-sm',
      'rounded'
    )
  })
})