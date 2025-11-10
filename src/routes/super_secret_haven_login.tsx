import { createFileRoute } from '@tanstack/react-router'
import { Flex } from '@chakra-ui/react'
import { DiscordSignInButton } from '../components/DiscordSignInButton'

export const Route = createFileRoute('/super_secret_haven_login')({
  component: LoginPage,
  staticData: {
    ssr: false,
  },
})

function LoginPage() {
  return (
    <Flex alignItems="center" justifyContent="center" h="full">
      <DiscordSignInButton respect={false} />
    </Flex>
  )
}
