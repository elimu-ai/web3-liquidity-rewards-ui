import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { Alert } from '@mui/material'
import { WagmiConfig, createClient, configureChains, defaultChains, useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import UniswapV2Pair from '../abis/UniswapV2Pair.json'
import UniswapPoolRewards from '../abis/UniswapPoolRewards.json'
import { ethers } from 'ethers'

const { chains, provider, webSocketProvider } = configureChains(
  defaultChains,
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
})

function ApproveButtonWrapper() {
  console.log('ApproveButtonWrapper')
  return (
    <WagmiConfig client={client}>
      <ApproveButton />
    </WagmiConfig>
  )
}

function ApproveButton() {
  console.log('ApproveButton')

  const { config, error } = usePrepareContractWrite({
    addressOrName: '0x9936bdcd16e8c709c4cb8d7b871f0011b4cc65de',
    contractInterface: UniswapV2Pair.abi,
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
    <WagmiConfig client={client}>
      <DepositButton depositAmount={depositAmount} />
    </WagmiConfig>
  )
}

function DepositButton({ depositAmount }: any) {
  console.log('DepositButton')

  console.log('depositAmount:', depositAmount)

  const { config, error } = usePrepareContractWrite({
    addressOrName: '0xb8b6430b58a4fbc57bd5cd7715d318065f2dcd81',
    contractInterface: UniswapPoolRewards.abi,
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
          // disabled
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
          <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
            <h3 className="text-2xl mb-4 font-bold">1. Approve Pool Tokens</h3>
            <p>Approve the amount of Uniswap pool tokens to be deposited into the elimu.ai rewards smart contract.</p>
            <ApproveButtonWrapper />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
            <h3 className="text-2xl mb-4 font-bold">2. Deposit Pool Tokens</h3>
            <p>Deposit your pool tokens into the elimu.ai rewards smart contract to start earning rewards.</p>
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
                <DepositButtonWrapper depositAmount={0.1} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
