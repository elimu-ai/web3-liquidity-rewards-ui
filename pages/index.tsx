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

const { publicClient } = configureChains([mainnet], [publicProvider()])
const config = createConfig({ autoConnect: true, publicClient })

let ethBalanceUniswap = 0.00
let ethBalanceSushiSwap = 0.00
let ethBalanceBalancer = 0.00

function LiquidityPool({ poolName }: any) {
  console.log('LiquidityPool')
  return (
    <WagmiConfig config={config}>
      <LiquidityPoolDetails poolName={poolName} />
    </WagmiConfig>
  )
}

function LiquidityPoolDetails({ poolName }: any) {
  console.log('LiquidityPoolDetails')

  let ethBalanceAsString : string = '0.00'

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
    return (
      <>
        Loading...
      </>
    )
  }

  if (data != undefined) {
    let ethBalanceBigInt: BigNumberish = BigInt(0)
    let poolTokenHoldings: any[] = data
    console.log('poolTokenHoldings:', poolTokenHoldings)
    if ((poolName == 'uniswap') || (poolName == 'sushiswap')) {
      ethBalanceBigInt = poolTokenHoldings[0]
    } else if (poolName == 'balancer') {
      ethBalanceBigInt = poolTokenHoldings[1][0]
    }
    console.log('ethBalanceBigInt:', ethBalanceBigInt)
    const ethBalanceDecimal = Number(ethers.utils.formatEther(ethBalanceBigInt))
    console.log('ethBalanceDecimal:', ethBalanceDecimal)
    ethBalanceAsString = ethBalanceDecimal.toFixed(2)

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

  console.log('ethBalanceAsString:', ethBalanceAsString)

  return(
    <p className="mt-2">
      Liquidity: {ethBalanceAsString} <code className="font-mono">$WETH</code> &nbsp;&nbsp;&nbsp; APY: 0.00%
    </p>
  )
}

export default function Home() {
  console.log('Home')
  return (
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
                <code className="p-3 font-mono bg-gray-100 rounded-md">$WETH/$ELIMU 50%/50%</code>
              </p>
              <p className="mt-4">
                Token emissions: 0.00 <code className="font-mono">$ELIMU</code>/day
              </p>
              <LiquidityPool poolName='uniswap' />
            </Link>
            <Link href="/uniswap">
              <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Deposit UNI-V2 pool tokens</button>
            </Link>
          </div>

          <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
            <a href="/sushiswap" className="hover:text-purple-600 focus:text-purple-600">
              <h3 className="text-2xl font-bold">SushiSwap Liquidity Pool 🍣</h3>
              <p className="mt-4">
                <code className="p-3 font-mono bg-gray-100 rounded-md">$WETH/$ELIMU 50%/50%</code>
              </p>
              <p className="mt-4">
                Token emissions: 0.00 <code className="font-mono">$ELIMU</code>/day
              </p>
              <LiquidityPool poolName='sushiswap' />
            </a>
            <a href="/sushiswap">
              <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Deposit SLP pool tokens</button>
            </a>
          </div>
          
          <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
            <a href="/balancer" className="hover:text-purple-600 focus:text-purple-600">
              <h3 className="text-2xl font-bold">Balancer Liquidity Pool ⚖️</h3>
              <p className="mt-4">
                <code className="p-3 font-mono bg-gray-100 rounded-md">$WETH/$ELIMU 20%/80%</code>
              </p>
              <p className="mt-4">
                Token emissions: 0.00 <code className="font-mono">$ELIMU</code>/day
              </p>
              <LiquidityPool poolName='balancer' />
            </a>
            <a href="/balancer">
              <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Deposit 20WETH-80ELIMU pool tokens</button>
            </a>
          </div>

          <div className=" bg-white p-6 mt-6 border w-96 rounded-2xl text-left">
            <h3 className="font-bold">What is <code>$ELIMU</code>? 💎</h3>
            <p>
              <a className="text-purple-600" href="https://etherscan.io/token/0xe29797910d413281d2821d5d9a989262c8121cc2">
                <code className="font-mono">$ELIMU</code>
              </a> is the governance token used by the elimu.ai 
              Community DAO. You can learn more at&nbsp;
              <a href="https://eng.elimu.ai/contributions/aragon-dao" className="text-purple-600">elimu.ai</a>
              &nbsp;and <a href="https://github.com/elimu-ai/wiki#donate-cryptocurrency-eth" className="text-purple-600">https://github.com/elimu-ai/wiki</a>.
            </p>
          </div>

          <div className="bg-white mt-10 p-6 rounded-2xl w-full">
            <h2 className="text-4xl">Total <code className="p-3 font-mono bg-gray-100 rounded-md">$WETH</code> Liquidity: <b id="totalLiquidityAmount">Loading...</b></h2>
            <iframe className="mt-6 border-t pt-6" src="https://dune.com/embeds/970563/1681039/4e64d66f-fada-4687-8410-2ee8dd31b126" width="100%" height="400"></iframe>
            <iframe className="mt-6 border-t pt-6" src="https://dune.com/embeds/979280/1696305/0bbe44ba-afb6-4350-8e67-ff7d8a94e795" width="100%" height="400"></iframe>
            <iframe className="mt-6 border-t pt-6" src="https://dune.com/embeds/963960/1672195/22529049-6e7d-4f84-bcc2-d68cd1fc0461" width="100%" height="400"></iframe>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
