import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useAccount } from 'wagmi'
import PoolTokenBalance from '../components/uniswap/PoolTokenBalance'
import ClaimableReward from '../components/uniswap/ClaimableReward'
import PoolTokenDeposits from '../components/uniswap/PoolTokenDeposits'
import RewardDetails from '../components/uniswap/RewardDetails'
import ClaimRewardsFlow from '../components/uniswap/ClaimRewardsFlow'
import DepositPoolTokensFlow from '../components/uniswap/DepositPoolTokensFlow'
import WithdrawPoolTokensFlow from '../components/uniswap/WithdrawPoolTokensFlow'

export default function Uniswap() {
  console.log('Uniswap')

  const { address, isConnecting, isDisconnected } = useAccount()
  console.log('address:', address)

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
          <div className="bg-white mt-6 border w-96 rounded-2xl drop-shadow-md">
            <div className='p-6'>
              <h3 className="text-2xl font-bold">1. Provide Liquidity 💧</h3>
              <p className='mt-4'>
                Provide liquidity to the <a className="font-bold text-purple-600" target="_blank" rel="noreferrer" href="https://app.uniswap.org/positions/create/v2?currencyA=NATIVE&currencyB=0xe29797910d413281d2821d5d9a989262c8121cc2">Uniswap pool</a>
                , and receive Uniswap pool tokens.
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
              <p className='mt-4'>Deposit your Uniswap pool tokens into the elimu.ai rewards <a className="font-bold text-purple-600" target="_blank" rel="noreferrer" href="https://etherscan.io/address/0x6ba828e01713cef8ab59b64198d963d0e42e0aea#code">smart contract</a> to start earning rewards.</p>
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

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="bg-white mt-6 border w-96 rounded-2xl drop-shadow-md">
            <div className='p-6'>
              <h3 className="text-2xl font-bold">4. Withdraw Pool Tokens 🏧</h3>
              <p className='mt-4'>
                Withdraw your deposited Uniswap pool tokens. Optionally claim rewards in the same transaction.
              </p>
              <div className='mt-4'>
                <WithdrawPoolTokensFlow address={address} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
