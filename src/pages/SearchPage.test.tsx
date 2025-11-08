import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Providers from '../Providers'
import SearchPage from './SearchPage'

describe('SearchPage', () => {
  it('renders search input', () => {
    render(
      <Providers>
        <SearchPage />
      </Providers>,
    )

  const input = screen.getByPlaceholderText(/Search anime/i)
  // use a plain DOM assertion to avoid jest-dom typing mismatch
  expect(input).not.toBeNull()
  })
})
