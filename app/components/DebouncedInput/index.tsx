'use client'

import React , { useEffect, useState } from 'react'

interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  delay?: number
}

export default function DebouncedInput({ value, onChange, delay = 500, ...props }: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue)
    }, delay)

    return () => clearTimeout(handler)
  }, [localValue, delay, onChange])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <input
      {...props}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  )
}
