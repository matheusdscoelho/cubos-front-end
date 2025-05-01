import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import DebouncedInput from '.'

describe('DebouncedInput', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should render with initial value', () => {
    render(
      <DebouncedInput
        value="initial"
        onChange={() => {}}
        placeholder="Type something"
      />
    )

    expect(screen.getByRole('textbox')).toHaveValue('initial')
  })

  it('should update local value immediately when typing', () => {
    render(
      <DebouncedInput
        value=""
        onChange={() => {}}
        placeholder="Type something"
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(input).toHaveValue('test')
  })

  it('should call onChange after delay', async () => {
    const handleChange = vi.fn()
    
    render(
      <DebouncedInput
        value=""
        onChange={handleChange}
        delay={500}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(handleChange).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(handleChange).toHaveBeenCalledWith('test')
  })

  it('should update value when prop changes', () => {
    const { rerender } = render(
      <DebouncedInput
        value="initial"
        onChange={() => {}}
      />
    )

    expect(screen.getByRole('textbox')).toHaveValue('initial')

    rerender(
      <DebouncedInput
        value="updated"
        onChange={() => {}}
      />
    )

    expect(screen.getByRole('textbox')).toHaveValue('updated')
  })

  it('should clear timeout on unmount', () => {
    const handleChange = vi.fn()
    const { unmount } = render(
      <DebouncedInput
        value=""
        onChange={handleChange}
        delay={500}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    unmount()
    
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('should pass through additional props', () => {
    render(
      <DebouncedInput
        value=""
        onChange={() => {}}
        data-testid="custom-input"
        placeholder="Custom placeholder"
        className="custom-class"
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('data-testid', 'custom-input')
    expect(input).toHaveAttribute('placeholder', 'Custom placeholder')
    expect(input).toHaveClass('custom-class')
  })

  it('should handle multiple rapid changes', () => {
    const handleChange = vi.fn()
    
    render(
      <DebouncedInput
        value=""
        onChange={handleChange}
        delay={500}
      />
    )

    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.change(input, { target: { value: 'ab' } })
    fireEvent.change(input, { target: { value: 'abc' } })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(handleChange).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('abc')
  })
})