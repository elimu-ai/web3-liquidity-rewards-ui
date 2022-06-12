import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <Head>
        <title>Liquidity Provider Rewards | elimu.ai</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Rewards for {' '}
          <a className="text-purple-600" href="https://etherscan.io/token/0xe29797910d413281d2821d5d9a989262c8121cc2">
            $ELIMU
          </a> LPs
        </h1>

        <p className="mt-3 text-2xl">
          Get started by connecting your wallet
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
            <a href="/uniswap" className="hover:text-purple-600 focus:text-purple-600">
              <h3 className="text-2xl font-bold">Uniswap Liquidity Pool 🦄</h3>
              <p className="mt-4 text-xl">
                <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">$ETH/$ELIMU 50%/50%</code>
              </p>
              <p className="mt-4">
                Token emissions: 0.00 <code className="font-mono">$ELIMU</code>/day
              </p>
              <p className="mt-2">
                TVL: 0.00 <code className="font-mono">$ETH</code> &nbsp;&nbsp;&nbsp; APY: 0.00%
              </p>
            </a>
            <a href="/uniswap">
              <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Deposit UNI-V2 pool tokens</button>
            </a>
          </div>

          <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
            <a href="/sushiswap" className="hover:text-purple-600 focus:text-purple-600">
              <h3 className="text-2xl font-bold">SushiSwap Liquidity Pool 🍣</h3>
              <p className="mt-4 text-xl">
                <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">$ETH/$ELIMU 50%/50%</code>
              </p>
              <p className="mt-4">
                Token emissions: 0.00 <code className="font-mono">$ELIMU</code>/day
              </p>
              <p className="mt-2">
                TVL: 0.00 <code className="font-mono">$ETH</code> &nbsp;&nbsp;&nbsp; APY: 0.00%
              </p>
            </a>
            <a href="/sushiswap">
              <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4">Deposit SLP pool tokens</button>
            </a>
          </div>
          
          <div className="bg-white p-6 mt-6 border w-96 rounded-2xl drop-shadow-md">
            <a href="/balancer" className="hover:text-purple-600 focus:text-purple-600">
              <h3 className="text-2xl font-bold">Balancer Liquidity Pool ⚖️</h3>
              <p className="mt-4 text-xl">
                <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">$ETH/$ELIMU 20%/80%</code>
              </p>
              <p className="mt-4">
                Token emissions: 0.00 <code className="font-mono">$ELIMU</code>/day
              </p>
              <p className="mt-2">
                TVL: 0.00 <code className="font-mono">$ETH</code> &nbsp;&nbsp;&nbsp; APY: 0.00%
              </p>
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
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t mt-10">
        Made with 💜 by&nbsp;<a href="https://eng.elimu.ai" className="text-purple-600">elimu.ai</a>
      </footer>
    </div>
  )
}
