import Image from "next/image"
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient } = configureChains([mainnet], [publicProvider()])
const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient
})

function Wallet() {
  return (
    <WagmiConfig config={config}>
      <Profile />
    </WagmiConfig>
  )
}

import { useConnect, useAccount, useEnsName, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useIsMounted } from "../hooks/useIsMounted"
import Link from "next/link"
import ElimuBalance from "./ElimuBalance"

function Profile() {
  console.log('Profile')
  const { address, connector, isConnecting, isDisconnected } = useAccount()
  console.log('address:', address)
  console.log('connector:', connector)
  const { connect, connectors } = useConnect()
  console.log('connectors:', connectors)
  console.log('connectors[0]:', connectors[0])
  
  const { data: ensName } = useEnsName({ address })
  const { disconnect } = useDisconnect()
  
  if (useIsMounted() && (address != undefined)) {
    const addressShortened : string = `${address.substring(0, 6)}...${address.substring(38, 42)}`
    let addressOrEnsName = addressShortened
    if (ensName != undefined) {
      addressOrEnsName = ensName
    }
    return (
      <div className="bg-purple-100 rounded-full">
        <code className="p-4 pl-6 pr-6"><ElimuBalance address={address} /></code>
        <button onClick={() => disconnect()} className="bg-purple-200 hover:bg-purple-600 text-purple-800 hover:text-white text-white font-bold rounded-full p-4 pl-6 pr-6">{addressOrEnsName}</button>
      </div>
    )
  }
  return <button onClick={() => connect({ connector: connectors[0] })} className="bg-purple-200 hover:bg-purple-600 text-purple-800 hover:text-white text-white font-bold rounded-full p-4 pl-6 pr-6">Connect Wallet</button>
}

export default function Header() {
  console.log('Header')
  return (
    <>
      <header className="flex items-center justify-center w-full h-22 border-b mb-10 p-4">
        <div className='w-96'>
          <Link href="/">
            <Image src="/logo-208x208.png" alt="elimu.ai" width={50} height={50} />
          </Link>
        </div>
        <div className='w-96 flex justify-end'>
          <Wallet />
        </div>
      </header>
    </>
  )
}
