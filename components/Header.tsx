import Image from "next/image"
import { WagmiConfig, createClient, configureChains, defaultChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  defaultChains,
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
})

function Wallet() {
  return (
    <WagmiConfig client={client}>
      <Profile />
    </WagmiConfig>
  )
}

import { useConnect, useAccount, useEnsName, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function Profile() {
  console.log('Profile')
  const { connect } = useConnect({connector: new InjectedConnector()})
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { disconnect } = useDisconnect()
  
  if (address != undefined) {
    const addressShortened : string = `${address.substring(0, 6)}...${address.substring(38, 42)}`
    let addressOrEnsName = addressShortened
    if (ensName != undefined) {
      addressOrEnsName = ensName
    }
    return (
      <div>
        <button onClick={() => disconnect()} className="bg-purple-200 hover:bg-purple-600 text-purple-800 hover:text-white text-white font-bold rounded-full p-4 pl-6 pr-6">{addressOrEnsName}</button>
      </div>
    )
  }
  return <button onClick={() => connect()} className="bg-purple-200 hover:bg-purple-600 text-purple-800 hover:text-white text-white font-bold rounded-full p-4 pl-6 pr-6">Connect Wallet</button>
}

export default function Header() {
  console.log('Header')
  return (
    <>
      <header className="flex items-center justify-center w-full h-22 border-b mb-10 p-4">
        <div className='w-96'>
          <Image src="/logo-208x208.png" alt="elimu.ai" width={50} height={50} />
        </div>
        <div className='w-96 text-right'>
          <Wallet />
        </div>
      </header>
    </>
  )
}
