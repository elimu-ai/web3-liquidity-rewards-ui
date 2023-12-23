import Head from 'next/head'
import Link from 'next/link'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { WagmiConfig, configureChains, useContractRead, mainnet, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import UniswapV2Pair from '../abis/UniswapV2Pair.json'
import SushiSwapLPToken from '../abis/SushiSwapLPToken.json'
import BalancerVault from '../abis/BalancerVault.json'
import { useIsMounted } from '../hooks/useIsMounted'
import { BigNumberish, ethers } from 'ethers'
import RewardDetailsUniswap from '../components/uniswap/RewardDetails'
import RewardDetailsSushiSwap from '../components/sushiswap/RewardDetails'
import RewardDetailsBalancer from '../components/balancer/RewardDetails'
import Image from 'next/image'

const { publicClient } = configureChains([mainnet], [publicProvider()])
const config = createConfig({ autoConnect: true, publicClient })

let ethBalanceUniswap = 0.00
let ethBalanceSushiSwap = 0.00
let ethBalanceBalancer = 0.00

function LiquidityPoolDetails({ poolName }: any) {
  console.log('LiquidityPoolDetails')

  let ethBalanceDecimal : number = 0.00
  let elimuBalanceDecimal : number = 0.00
  
  let address : any = ''
  let abi : any = undefined
  let functionName : string = ''
  let args : any = undefined
  if (poolName == 'uniswap') {
    address = '0xa0d230dca71a813c68c278ef45a7dac0e584ee61',
    abi = UniswapV2Pair.abi
    functionName = 'getReserves'
  } else if (poolName == 'sushiswap') {
    address = '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
    abi = SushiSwapLPToken.abi
    functionName = 'getReserves'
  } else if (poolName == 'balancer') {
    address = '0xba12222222228d8ba445958a75a0704d566bf2c8',
    abi = BalancerVault.abi
    functionName = 'getPoolTokens'
    args = ['0x517390b2b806cb62f20ad340de6d98b2a8f17f2b0002000000000000000001ba']
  }

  const { data, isError, isLoading } = useContractRead({
    address: address,
    abi: abi,
    functionName: functionName,
    args: args
  })
  console.log('data:', data)

  if (!useIsMounted() || isLoading) {
    return(
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    )
  }

  if (data != undefined) {
    let ethBalanceBigInt: BigNumberish = BigInt(0)
    let elimuBalanceBigInt: BigNumberish = BigInt(0)
    let poolTokenHoldings: any[] = data
    console.log('poolTokenHoldings:', poolTokenHoldings)
    if ((poolName == 'uniswap') || (poolName == 'sushiswap')) {
      ethBalanceBigInt = poolTokenHoldings[0]
      elimuBalanceBigInt = poolTokenHoldings[1]
    } else if (poolName == 'balancer') {
      ethBalanceBigInt = poolTokenHoldings[1][0]
      elimuBalanceBigInt = poolTokenHoldings[1][1]
    }
    console.log('ethBalanceBigInt:', ethBalanceBigInt)
    console.log('elimuBalanceBigInt:', elimuBalanceBigInt)
    ethBalanceDecimal = Number(ethers.utils.formatEther(ethBalanceBigInt))
    elimuBalanceDecimal = Number(ethers.utils.formatEther(elimuBalanceBigInt))

    if (poolName == 'uniswap') {
      ethBalanceUniswap = ethBalanceDecimal
    } else if (poolName == 'sushiswap') {
      ethBalanceSushiSwap = ethBalanceDecimal
    } else if (poolName == 'balancer') {
      ethBalanceBalancer = ethBalanceDecimal
    }
    const ethBalanceTotal = ethBalanceUniswap + ethBalanceSushiSwap + ethBalanceBalancer
    const totalLiquidityAmount = `Ξ${ethBalanceTotal.toFixed(2)}`
    let htmlElement = (document.getElementById('totalLiquidityAmount') as HTMLElement)
    htmlElement.innerHTML = totalLiquidityAmount
  }

  console.log('ethBalanceDecimal:', ethBalanceDecimal)
  console.log('elimuBalanceDecimal:', elimuBalanceDecimal)

  return(
    <>
      <p>
        <code>{ethBalanceDecimal.toFixed(2)} <Image className='inline-block' width={16} height={16} src='https://etherscan.io/token/images/weth_28.png' alt='$WETH' /> / {elimuBalanceDecimal.toLocaleString(undefined, {maximumFractionDigits: 0})} <Image className='inline-block' width={16} height={16} src='https://etherscan.io/token/images/elimuai_32.png' alt='$ELIMU' /></code>
      </p>
      <div className='mt-4 border-t pt-4'>
        {(poolName == 'uniswap') && (
          <RewardDetailsUniswap />
        )}
        {(poolName == 'sushiswap') && (
          <RewardDetailsSushiSwap />
        )}
        {(poolName == 'balancer') && (
          <RewardDetailsBalancer />
        )}
      </div> 
    </>
  )
}

export default function Home() {
  console.log('Home')
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
            Rewards for {' '}
            <a className="text-purple-600" href="https://etherscan.io/token/0xe29797910d413281d2821d5d9a989262c8121cc2">
              $ELIMU
            </a> LPs
          </h1>

          <p className="mt-3 text-2xl">
            Get started by connecting your Ethereum wallet ☝🏽
          </p>

          <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
            <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
              <Link href="/uniswap" className="hover:text-purple-600 focus:text-purple-600">
                <h3 className="text-2xl font-bold">Uniswap Liquidity Pool 🦄</h3>
                <p className="mt-4">
                  <code className="p-3 font-mono bg-gray-100 rounded-md">50% $WETH / 50% $ELIMU</code>
                </p>
                <div className='mt-4'>
                  <LiquidityPoolDetails poolName='uniswap' />
                </div>
              </Link>
              <Link href="/uniswap">
                <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Deposit Uniswap pool tokens</button>
              </Link>
            </div>

            <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
              <Link href="/sushiswap" className="hover:text-purple-600 focus:text-purple-600">
                <h3 className="text-2xl font-bold">SushiSwap Liquidity Pool 🍣</h3>
                <p className="mt-4">
                  <code className="p-3 font-mono bg-gray-100 rounded-md">50% $WETH / 50% $ELIMU</code>
                </p>
                <div className='mt-4'>
                  <LiquidityPoolDetails poolName='sushiswap' />
                </div>
              </Link>
              <Link href="/sushiswap">
                <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Deposit SushiSwap pool tokens</button>
              </Link>
            </div>
            
            <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
              <Link href="/balancer" className="hover:text-purple-600 focus:text-purple-600">
                <h3 className="text-2xl font-bold">Balancer Liquidity Pool ⚖️</h3>
                <p className="mt-4">
                  <code className="p-3 font-mono bg-gray-100 rounded-md">20% $WETH / 80% $ELIMU</code>
                </p>
                <div className='mt-4'>
                  <LiquidityPoolDetails poolName='balancer' />
                </div>
              </Link>
              <Link href="/balancer">
                <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Deposit Balancer pool tokens</button>
              </Link>
            </div>

            <div className=" bg-white p-6 mt-6 border w-96 rounded-2xl text-left">
              <h3 className="font-bold">What is <code>$ELIMU</code>? 💎</h3>
              <p>
                <a className="text-purple-600" href="https://etherscan.io/token/0xe29797910d413281d2821d5d9a989262c8121cc2">
                  <code className="font-mono">$ELIMU</code>
                </a> is the governance token used by the Ξlimu DAO. You can learn more at&nbsp;
                <a href="https://github.com/elimu-ai/web3-wiki#readme" className="text-purple-600">https://github.com/elimu-ai/web3-wiki#readme</a>.
              </p>
            </div>

            <div className="bg-white mt-10 p-6 rounded-2xl w-full">
              <h2 className="text-4xl">Total Liquidity: <b id="totalLiquidityAmount">Loading...</b></h2>
              <iframe className="mt-6 border-t pt-6" src="https://dune.com/embeds/3305636/5536104" width="100%" height="400"></iframe>
              <iframe className="mt-6 border-t pt-6" src="https://dune.com/embeds/3305671/5536166" width="100%" height="400"></iframe>
              <iframe className="mt-6 border-t pt-6" src="https://dune.com/embeds/3305688/5536202" width="100%" height="400"></iframe>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </WagmiConfig>
  )
}
