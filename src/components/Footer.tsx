import { Box, Text } from '@chakra-ui/react'
import { useAppColorMode } from '../hooks/useAppColorMode'

export default function Footer() {
  const { mode } = useAppColorMode()
  const textColor = mode === 'light' ? 'white' : 'gray.100'
  return (
    <Box as="footer" bg={mode === 'light' ? 'blue.600' : 'gray.800'} color={textColor} py={{ base: 4, md: 6 }} mt={8}>
      <Text textAlign="center" fontSize="sm">Built with Jikan API • Demo</Text>
    </Box>
  )
}
