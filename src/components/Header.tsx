import { Box, Flex, Heading } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useAppColorMode } from '../hooks/useAppColorMode'

export default function Header() {
  const { mode, toggle } = useAppColorMode()

  const textColor = mode === 'light' ? 'white' : 'gray.100'

  return (
    <Box as="header" bg={mode === 'light' ? 'blue.600' : 'gray.800'} color={textColor} py={{ base: 3, md: 4 }} px={{ base: 4, md: 6 }} boxShadow="sm">
      <Flex maxW="1100px" mx="auto" align="center" justify="space-between">
        <Heading size="sm">Anime Search</Heading>
        <nav>
          <Link to="/" style={{ color: textColor, fontSize: '0.9rem' }}>
            Home
          </Link>
        </nav>
        <button onClick={() => toggle()} aria-label="Toggle dark mode" style={{ background: 'transparent', border: 'none', color: textColor, fontSize: 18 }}>
          {mode === 'light' ? '🌙' : '☀️'}
        </button>
      </Flex>
    </Box>
  )
}
