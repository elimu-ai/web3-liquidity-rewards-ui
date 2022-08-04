import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { WagmiConfig, createClient, configureChains, defaultChains, useContractRead, usePrepareContractWrite } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import UniswapV2Pair from '../abis/UniswapV2Pair.json'

const { chains, provider, webSocketProvider } = configureChains(
  defaultChains,
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
})

export default function Uniswap() {
  console.log('Uniswap')
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <Head>
        <title>Liquidity Provider Rewards | elimu.ai</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
            Uniswap Liquidity Pool 🦄
        </h1>

        <p className="mt-3 text-2xl">
            Get started by connecting your Ethereum wallet ☝🏽
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
            <h3 className="text-2xl mb-4 font-bold">1. Approve Pool Tokens</h3>
            <p>Approve the amount of Uniswap pool tokens to be deposited into the elimu.ai rewards smart contract.</p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Approve UNI-V2 pool tokens</button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
            <h3 className="text-2xl mb-4 font-bold">2. Deposit Pool Tokens</h3>
            <p>Deposit your pool tokens into the elimu.ai rewards smart contract to start earning rewards.</p>
            <div className="input-group">
                <input
                    type="number"
                    placeholder="Amount"
                    className="input input-bordered w-full"
                    />
                <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Deposit UNI-V2 pool tokens</button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
