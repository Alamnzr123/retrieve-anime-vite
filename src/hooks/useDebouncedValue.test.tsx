import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import useDebouncedValue from './useDebouncedValue'

function TestComp({ value, delay }: { value: string; delay: number }) {
  const debounced = useDebouncedValue(value, delay)
  return <div data-testid="debounced">{debounced}</div>
}

describe('useDebouncedValue', () => {
  it('debounces the value', async () => {
    const { rerender } = render(<TestComp value="a" delay={50} />)
    expect(screen.getByTestId('debounced').textContent).toBe('a')

    rerender(<TestComp value="b" delay={50} />)
    // still old value until debounce expires
    expect(screen.getByTestId('debounced').textContent).toBe('a')

    await waitFor(() => expect(screen.getByTestId('debounced').textContent).toBe('b'), { timeout: 200 })
  })
})
