import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Spinner from './index'

describe('Spinner', () => {
  it('should render with default props', () => {
    const { container } = render(<Spinner />)
    const spinner = container.firstChild as HTMLElement
    
    expect(spinner).toBeInTheDocument()
    expect(spinner.style.width).toBe('20px')
    expect(spinner.style.height).toBe('20px')
    expect(spinner.style.borderWidth).toBe('2px')
    expect(spinner.className).toContain('border-white')
    expect(spinner.className).toContain('border-t-transparent')
    expect(spinner.className).toContain('rounded-full')
    expect(spinner.className).toContain('animate-spin')
  })

  it('should render with custom size', () => {
    const { container } = render(<Spinner size={40} />)
    const spinner = container.firstChild as HTMLElement
    
    expect(spinner.style.width).toBe('40px')
    expect(spinner.style.height).toBe('40px')
    expect(spinner.style.borderWidth).toBe('4px') // 40/10 = 4
  })

  it('should render with custom color', () => {
    const { container } = render(<Spinner color="gray-800" />)
    const spinner = container.firstChild as HTMLElement
    
    expect(spinner.className).toContain('border-gray-800')
    expect(spinner.className).toContain('border-t-transparent')
  })

  it('should render with custom className', () => {
    const { container } = render(<Spinner className="my-custom-class" />)
    const spinner = container.firstChild as HTMLElement
    
    expect(spinner.className).toContain('my-custom-class')
  })

  it('should calculate border width proportionally', () => {
    const testCases = [
      { size: 10, expectedBorder: '2px' }, // minimum 2px
      { size: 20, expectedBorder: '2px' },
      { size: 50, expectedBorder: '5px' },
      { size: 100, expectedBorder: '10px' },
    ]

    testCases.forEach(({ size, expectedBorder }) => {
      const { container } = render(<Spinner size={size} />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner.style.borderWidth).toBe(expectedBorder)
    })
  })

  it('should combine all custom props correctly', () => {
    const { container } = render(
      <Spinner 
        size={30} 
        color="blue-500" 
        className="my-custom-class"
      />
    )
    const spinner = container.firstChild as HTMLElement
    
    expect(spinner.style.width).toBe('30px')
    expect(spinner.style.height).toBe('30px')
    expect(spinner.style.borderWidth).toBe('3px')
    expect(spinner.className).toContain('border-blue-500')
    expect(spinner.className).toContain('my-custom-class')
    expect(spinner.className).toContain('border-t-transparent')
    expect(spinner.className).toContain('rounded-full')
    expect(spinner.className).toContain('animate-spin')
  })

  it('should maintain minimum border width of 2px for small sizes', () => {
    const { container } = render(<Spinner size={5} />)
    const spinner = container.firstChild as HTMLElement
    
    expect(spinner.style.borderWidth).toBe('2px') // should not go below 2px
  })
})