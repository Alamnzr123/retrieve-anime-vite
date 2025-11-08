import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useAppColorMode } from './hooks/useAppColorMode'
import SearchPage from './pages/SearchPage'
import DetailPage from './pages/DetailPage'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  const { mode } = useAppColorMode()
  return (
    <Box bg={mode === 'light' ? 'gray.50' : 'gray.900'}>
      <Header />

      <Box as="main" maxW="1100px" mx="auto" px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/anime/:id" element={<DetailPage />} />
        </Routes>
      </Box>

      <Footer />
    </Box>
  )
}
