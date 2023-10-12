import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { WagmiConfig, configureChains, mainnet, createConfig, useAccount } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import PoolTokenBalance from '../components/sushiswap/PoolTokenBalance'
import ClaimableReward from '../components/sushiswap/ClaimableReward'
import PoolTokenDeposits from '../components/sushiswap/PoolTokenDeposits'
import RewardDetails from '../components/sushiswap/RewardDetails'
import ClaimRewardsFlow from '../components/sushiswap/ClaimRewardsFlow'
import DepositPoolTokensFlow from '../components/sushiswap/DepositPoolTokensFlow'

const { publicClient } = configureChains([mainnet], [publicProvider()])
const config = createConfig({ autoConnect: true, publicClient })

export default function SushiSwap() {
  console.log('SushiSwap')

  const { address, isConnecting, isDisconnected } = useAccount()
  console.log('address:', address)

  return (
    <WagmiConfig config={config}>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
        <Head>
          <title>Liquidity Provider Rewards | elimu.ai</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold">
              SushiSwap Liquidity Pool 🦄
          </h1>

          <p className="mt-3 text-2xl">
              Get started by connecting your Ethereum wallet ☝🏽
          </p>

          <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
            <div className="bg-white mt-6 border w-96 rounded-2xl drop-shadow-md">
              <div className='p-6'>
                <h3 className="text-2xl font-bold">1. Provide Liquidity 💧</h3>
                <p className='mt-4'>
                  Provide liquidity to the <a className="font-bold text-purple-600" target="_blank" rel="noreferrer" href="https://app.sushi.com/add/ETH/0xe29797910D413281d2821D5d9a989262c8121CC2">SushiSwap pool</a>
                  , and receive SushiSwap pool tokens.
                </p>
              </div>
              <div className='p-6 border-t-2 border-purple-100 bg-purple-50 rounded-b-2xl'>
                <p>
                  Your current pool token balance:
                </p>
                <code className='text-lg'>
                  <PoolTokenBalance address={address} />
                </code>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
            <div className="bg-white mt-6 border w-96 rounded-2xl drop-shadow-md">
              <div className='p-6'>
                <h3 className="text-2xl font-bold">2. Deposit Pool Tokens 📥</h3>
                <p className='mt-4'>Deposit your SushiSwap pool tokens into the elimu.ai rewards smart contract to start earning rewards.</p>
                <div className='mt-4'>
                  <DepositPoolTokensFlow address={address} />
                </div>
              </div>
              <div className='p-6 border-t-2 border-purple-100 bg-purple-50 rounded-b-2xl'>
                <p>
                  Your current pool token deposits:
                </p>
                <code className='text-lg'>
                  <PoolTokenDeposits address={address} />
                </code>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
            <div className="bg-white mt-6 border w-96 rounded-2xl drop-shadow-md">
              <div className='p-6'>
                <h3 className="text-2xl font-bold">3. Claim Rewards 💎</h3>
                <div className='mt-4'>
                  <RewardDetails />
                </div>
              </div>
              <div className='p-6 border-t-2 border-purple-100 bg-purple-50 rounded-b-2xl'>
                <p>
                  Your claimable reward:
                </p>
                <code className='text-lg'>
                  <ClaimableReward address={address} />
                </code>
                <div className='mt-4'>
                  <ClaimRewardsFlow address={address} />
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </WagmiConfig>
  )
}
