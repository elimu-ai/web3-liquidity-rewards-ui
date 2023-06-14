import { configureChains, createConfig, mainnet } from 'wagmi'
import UniswapPoolRewards from '../abis/UniswapPoolRewards.json'
import { publicProvider } from 'wagmi/providers/public'
import { useContractRead } from 'wagmi'
import { useIsMounted } from '../hooks/useIsMounted'
import { BigNumberish, ethers } from 'ethers'

const { publicClient } = configureChains([mainnet], [publicProvider()])
const config = createConfig({ autoConnect: true, publicClient })

export default function RewardDetails({ poolName }: any) {
    console.log('RewardDetails')
    console.log('poolName:', poolName)

    if ((poolName == 'sushiswap') || (poolName == 'balancer')) {
        return (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
        )
    }

    const { data, isError, isLoading } = useContractRead({
        address: '0x6ba828e01713cef8ab59b64198d963d0e42e0aea',
        abi: UniswapPoolRewards.abi,
        functionName: 'rewardRatePerSecond'
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
        )
    }

    const rewardRatePerMonth: BigNumberish = BigInt(Number(data) * 60 * 60 * 24 * 30)
    console.log('rewardRatePerMonth:', rewardRatePerMonth)
    const rewardRatePerMonthAsDecimal: string = ethers.utils.formatUnits(rewardRatePerMonth)
    console.log('rewardRatePerMonthAsDecimal:', rewardRatePerMonthAsDecimal)

    return (
        <>
            <p>
                Reward rate: {Number(rewardRatePerMonthAsDecimal).toLocaleString()} <code className="font-mono">$ELIMU</code>/month
            </p>
            <p>
                Estimated APY: <b>0.00%</b>
            </p>
        </>
    )
}
