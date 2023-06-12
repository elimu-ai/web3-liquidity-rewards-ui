import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { Alert } from '@mui/material'
import { WagmiConfig, configureChains, useContractRead, usePrepareContractWrite, useContractWrite, mainnet, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import UniswapV2Pair from '../abis/UniswapV2Pair.json'
import UniswapPoolRewards from '../abis/UniswapPoolRewards.json'
import { ethers } from 'ethers'

const { publicClient } = configureChains([mainnet], [publicProvider()])
const config = createConfig({ autoConnect: true, publicClient })

function ApproveButtonWrapper() {
  console.log('ApproveButtonWrapper')
  return (
    <WagmiConfig config={config}>
      <ApproveButton />
    </WagmiConfig>
  )
}

function ApproveButton() {
  console.log('ApproveButton')

  const { config, error } = usePrepareContractWrite({
    address: '0x9936bdcd16e8c709c4cb8d7b871f0011b4cc65de',
    abi: UniswapV2Pair.abi,
    functionName: 'approve',
    args: ['0x9ab3796159c939C2E3960Bd0D4D932C2697F24F1', ethers.utils.parseUnits('1000')]
  })

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onError(error) {
      console.log('onError:\n', error)
    },
    onSuccess(data) {
      console.log('onSuccess\n', data)
    }
  })
  
  return (
    <>
      <button 
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
          // disabled
          onClick={() => write?.()}>
        Approve UNI-V2 pool tokens
      </button>
      <div>
        {error && (
          <Alert severity="error">{error.message}</Alert>
        )}
        {isLoading && (
          <Alert severity="info">Check Wallet</Alert>
        )}
        {isSuccess && (
          <Alert severity="success">Transaction: {JSON.stringify(data)}</Alert>
        )}
      </div>
    </>
  )
}

function DepositButtonWrapper({ depositAmount }: any) {
  console.log('DepositButtonWrapper')
  console.log('depositAmount:', depositAmount)
  return (
    <WagmiConfig config={config}>
      <DepositButton depositAmount={depositAmount} />
    </WagmiConfig>
  )
}

function DepositButton({ depositAmount }: any) {
  console.log('DepositButton')

  console.log('depositAmount:', depositAmount)

  const { config, error } = usePrepareContractWrite({
    address: '0x9ab3796159c939C2E3960Bd0D4D932C2697F24F1',
    abi: UniswapPoolRewards.abi,
    functionName: 'depositPoolTokens',
    args: [ethers.utils.parseUnits(depositAmount.toString())]
  })

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onError(error) {
      console.log('onError:\n', error)
    },
    onSuccess(data) {
      console.log('onSuccess\n', data)
    }
  })
  
  return (
    <>
      <button 
          id="depositButton"
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
          disabled
          onClick={() => write?.()}>
        Deposit UNI-V2 pool tokens
      </button>
      <div>
        {error && (
          <Alert severity="error">{error.message}</Alert>
        )}
        {isLoading && (
          <Alert severity="info">Check Wallet</Alert>
        )}
        {isSuccess && (
          <Alert severity="success">Transaction: {JSON.stringify(data)}</Alert>
        )}
      </div>
    </>
  )
}

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
          <div className="bg-white mt-6 border w-96 rounded-2xl drop-shadow-md">
            <div className='p-6'>
              <h3 className="text-2xl font-bold">1. Provide Liquidity 💧</h3>
              <p className='mt-4'>
                Provide liquidity to the <a className="font-bold text-purple-600" target="_blank" rel="noreferrer" href="https://app.uniswap.org/#/add/v2/ETH/0xe29797910D413281d2821D5d9a989262c8121CC2">Uniswap pool</a>
                , and receive Uniswap pool tokens.
              </p>
            </div>
            <div className='p-6 border-t-2 border-purple-100 bg-purple-50 rounded-b-2xl'>
              <p>
                Your current pool token balance:
              </p>
              <code>
                0 $UNI-V2
              </code>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="bg-white mt-6 border w-96 rounded-2xl drop-shadow-md">
            <div className='p-6'>
              <h3 className="text-2xl font-bold">2. Deposit Pool Tokens ➕</h3>
              <p className='mt-4'>Deposit your Uniswap pool tokens into the elimu.ai rewards smart contract to start earning rewards.</p>
              <div className="input-group">
                  <input
                      id="depositInput"
                      type="number"
                      placeholder="Amount"
                      className="input mt-4 w-full p-4 border border-solid border-gray-300 rounded"
                      onChange={(event: any) => {
                        console.log('onChange')
                        const amount : Number = event.target.value
                        console.log('amount:', amount)
                        let depositButtonElement = (document.getElementById('depositButton') as HTMLButtonElement)
                        // if (amount > 0) {
                        //   depositButtonElement.disabled = false
                        // } else {
                        //   depositButtonElement.disabled = true
                        // }
                      }}
                      />
                  <ApproveButtonWrapper />
                  <DepositButtonWrapper depositAmount={0.1} />
              </div>
            </div>
            <div className='p-6 border-t-2 border-purple-100 bg-purple-50 rounded-b-2xl'>
              <p>
                Your current pool token deposits:
              </p>
              <code>
                0 $UNI-V2
              </code>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="bg-white mt-6 border w-96 rounded-2xl drop-shadow-md">
            <div className='p-6'>
              <h3 className="text-2xl font-bold">3. Claim Rewards 💎</h3>
              <p className='mt-4'>...</p>
            </div>
            <div className='p-6 border-t-2 border-purple-100 bg-purple-50 rounded-b-2xl'>
              <p>
                Your claimable reward:
              </p>
              <code>
                0 $ELIMU
              </code>
              <div>
                <button 
                    id="claimButton"
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
                    disabled>
                  Claim rewards
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
