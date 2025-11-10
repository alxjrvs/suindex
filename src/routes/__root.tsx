/// <reference types="vite/client" />
import { useEffect, useState } from 'react'
import { createRootRoute, Outlet, Scripts, HeadContent } from '@tanstack/react-router'
import { Box, Flex, ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { TopNavigation } from '../components/TopNavigation'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { GlobalLoadingBar } from '../components/shared/GlobalLoadingBar'
import { getSchemaCatalog } from 'salvageunion-reference'
import { getSession, onAuthStateChange } from '../lib/api'
import type { User } from '@supabase/supabase-js'
import { Toaster } from '../components/ui/ToasterComponent'
import { EntityViewerModalProvider } from '../providers/EntityViewerModalProvider'
import { fetchCurrentUser } from '../lib/supabase.server'
import { system } from '../theme'
import { queryClient } from '../lib/queryClient'
import type React from 'react'

const schemaIndexData = getSchemaCatalog()

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async () => {
    // Fetch user on server for SSR routes
    const serverUser = await fetchCurrentUser()
    return {
      serverUser,
    }
  },
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </QueryClientProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
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
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SUindex - Salvage Union Reference</title>
        <HeadContent />
      </head>
      <body>
        <Providers>
          <ErrorBoundary>
            <EntityViewerModalProvider>
              <GlobalLoadingBar />
              <Flex flexDirection="column" h="100vh" bg="su.white">
                <TopNavigation user={user} schemas={schemaIndexData.schemas} />
                <Box
                  as="main"
                  flex="1"
                  display="flex"
                  flexDirection="column"
                  pt={{ base: 16, md: 0 }}
                >
                  {children}
                </Box>
              </Flex>
              <Toaster />
            </EntityViewerModalProvider>
          </ErrorBoundary>
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}
