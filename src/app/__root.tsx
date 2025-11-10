import { useEffect, useState } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Box, Flex } from '@chakra-ui/react'
import { TopNavigation } from '../components/TopNavigation'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { getSchemaCatalog } from 'salvageunion-reference'
import { getSession, onAuthStateChange } from '../lib/api'
import type { User } from '@supabase/supabase-js'
import { Toaster } from '../components/ui/ToasterComponent'
import { EntityViewerModalProvider } from '../providers/EntityViewerModalProvider'

const schemaIndexData = getSchemaCatalog()

function RootComponent() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getSession().then((session) => {
      setUser(session?.user ?? null)
    })

    const subscription = onAuthStateChange((authUser) => {
      setUser(authUser)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <ErrorBoundary>
      <EntityViewerModalProvider>
        <Flex flexDirection="column" h="100vh" bg="su.white">
          <TopNavigation user={user} schemas={schemaIndexData.schemas} />
          <Box as="main" flex="1" display="flex" flexDirection="column" pt={{ base: 16, md: 0 }}>
            <Outlet />
          </Box>
        </Flex>
        <Toaster />
      </EntityViewerModalProvider>
    </ErrorBoundary>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})

