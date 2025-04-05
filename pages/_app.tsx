import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useReadContract, http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const queryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet], 
  transports: { 
    [mainnet.id]: http()
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default MyApp
