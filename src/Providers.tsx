import React from 'react'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'

export default function Providers({ children }: { children: React.ReactNode }) {
  const system = createSystem(defaultConfig)
  return (
    <ReduxProvider store={store}>
      <ChakraProvider value={system}>
        <BrowserRouter>{children}</BrowserRouter>
      </ChakraProvider>
    </ReduxProvider>
  )
}
