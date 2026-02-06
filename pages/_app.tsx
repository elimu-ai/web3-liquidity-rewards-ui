import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useReadContract, http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { fallback } from 'viem'

const queryClient = new QueryClient();

const primaryRpcUrl = '/api/rpc'
const secondaryRpcUrl = 'https://cloudflare-eth.com'

const config = createConfig({
  chains: [mainnet], 
  transports: {
    [mainnet.id]: fallback([
      http(primaryRpcUrl, { batch: true }),
      http(secondaryRpcUrl, { batch: true })
    ]),
  },
  connectors: [injected()]
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
