import Image from "next/image"
import { WagmiConfig, createClient } from 'wagmi'

const client = createClient()

function Wallet() {
  return (
    <WagmiConfig client={client}>
      <Profile />
    </WagmiConfig>
  )
}

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function Profile() {
  const { data } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  if (data) {
    const addressShortened = `${data.address?.substring(0, 6)}...${data.address?.substring(38, 42)}`
    return (
      <div>
        <button onClick={() => disconnect()} className="bg-purple-200 hover:bg-purple-600 text-purple-800 hover:text-white text-white font-bold rounded-full p-4 pl-6 pr-6">{addressShortened}</button>
      </div>
    )
  }
  return <button onClick={() => connect()} className="bg-purple-200 hover:bg-purple-600 text-purple-800 hover:text-white text-white font-bold rounded-full p-4 pl-6 pr-6">Connect Wallet</button>
}

export default function Header() {
  return (
    <>
      <header className="flex items-center justify-center w-full h-22 border-b mb-10 p-4">
        <div className='w-96'>
          <Image src="/logo-208x208.png" width={50} height={50} />
        </div>
        <div className='w-96 text-right'>
          <Wallet />
        </div>
      </header>
    </>
  )
}
