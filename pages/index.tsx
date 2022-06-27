import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { createClient, WagmiConfig, useContractRead } from 'wagmi'
import UniswapV2Pair from '../abis/UniswapV2Pair.json'
import SushiSwapLPToken from '../abis/SushiSwapLPToken.json'
import BalancerVault from '../abis/BalancerVault.json'

const client = createClient()

let ethBalanceUniswap = 0.00
let ethBalanceSushiSwap = 0.00
let ethBalanceBalancer = 0.00

function LiquidityPool({ poolName }: any) {
  console.log('LiquidityPool')
  return (
    <WagmiConfig client={client}>
      <LiquidityPoolDetails poolName={poolName} />
    </WagmiConfig>
  )
}

function LiquidityPoolDetails({ poolName }: any) {
  console.log('LiquidityPoolDetails')

  let ethBalance : string = '0.00'

  let addressOrName : string = ''
  let contractInterface : any = undefined
  let contractMethod : string = ''
  let contractArgs : any = undefined
  if (poolName == 'uniswap') {
    addressOrName = '0xa0d230dca71a813c68c278ef45a7dac0e584ee61',
    contractInterface = UniswapV2Pair.abi
    contractMethod = 'getReserves'
  } else if (poolName == 'sushiswap') {
    addressOrName = '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
    contractInterface = SushiSwapLPToken.abi
    contractMethod = 'getReserves'
  } else if (poolName == 'balancer') {
    addressOrName = '0xba12222222228d8ba445958a75a0704d566bf2c8',
    contractInterface = BalancerVault.abi
    contractMethod = 'getPoolTokens'
    contractArgs = { args: '0x517390b2b806cb62f20ad340de6d98b2a8f17f2b0002000000000000000001ba' }
  }

  const { data } = useContractRead(
    {
      addressOrName: addressOrName,
      contractInterface: contractInterface
    },
    contractMethod,
    contractArgs
  )
  if (data != undefined) {
    let ethBalanceHex : string = ''
    if ((poolName == 'uniswap') || (poolName == 'sushiswap')) {
      ethBalanceHex = data._reserve0._hex
    } else if (poolName == 'balancer') {
      ethBalanceHex = data.balances[0]._hex
    }
    const ethBalanceDecimal = parseInt(ethBalanceHex, 16) / 1_000_000_000_000_000_000
    ethBalance = ethBalanceDecimal.toFixed(2)

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

  console.log('ethBalance:', ethBalance)

  return(
    <p className="mt-2">
      TVL: {ethBalance} <code className="font-mono">$WETH</code> &nbsp;&nbsp;&nbsp; APY: 0.00%
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
            <a href="/uniswap" className="hover:text-purple-600 focus:text-purple-600">
              <h3 className="text-2xl font-bold">Uniswap Liquidity Pool 🦄</h3>
              <p className="mt-4 text-xl">
                <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">$WETH/$ELIMU 50%/50%</code>
              </p>
              <p className="mt-4">
                Token emissions: 0.00 <code className="font-mono">$ELIMU</code>/day
              </p>
              <LiquidityPool poolName='uniswap' />
            </a>
            <a href="/uniswap">
              <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Deposit UNI-V2 pool tokens</button>
            </a>
          </div>

          <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
            <a href="/sushiswap" className="hover:text-purple-600 focus:text-purple-600">
              <h3 className="text-2xl font-bold">SushiSwap Liquidity Pool 🍣</h3>
              <p className="mt-4 text-xl">
                <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">$WETH/$ELIMU 50%/50%</code>
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
              <p className="mt-4 text-xl">
                <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">$WETH/$ELIMU 20%/80%</code>
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
            <h2 className="text-4xl mb-6">Total Liquidity: <b id="totalLiquidityAmount">Loading...</b></h2>
            <iframe className="border-t pt-6" src="https://dune.com/embeds/963960/1672195/22529049-6e7d-4f84-bcc2-d68cd1fc0461" width="100%" height="400"></iframe>
            <iframe className="border-t pt-6" src="https://dune.com/embeds/970563/1681036/23aef6db-8ea5-4a09-91e2-72fd46a5b376" width="100%" height="400"></iframe>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
