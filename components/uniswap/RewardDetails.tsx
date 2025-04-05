import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import UniswapPoolRewards from '../../abis/UniswapPoolRewards.json'
import UniswapV2Pair from '../../abis/UniswapV2Pair.json'
import { useIsMounted } from '../../hooks/useIsMounted'
import { Alert } from '@mui/material'
import { BigNumber, BigNumberish, ethers } from 'ethers'

function RewardRate({ depositPercentage, depositReservesElimu }: any) {
    console.log('[uniswap] RewardRate')

    const { data, isError, isLoading } = useReadContract({
        address: '0x6ba828e01713cef8ab59b64198d963d0e42e0aea',
        abi: UniswapPoolRewards.abi,
        functionName: 'rewardRatePerSecond'
    })
    console.log('[uniswap] data:', data)
    console.log('[uniswap] isError:', isError)
    console.log('[uniswap] isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading reward rate</Alert>
    } else {
        const rewardRatePerMonth: BigNumberish = BigInt(Number(data) * 60 * 60 * 24 * 30)
        console.log('[uniswap] rewardRatePerMonth:', rewardRatePerMonth)
        const rewardRatePerMonthDecimal: string = ethers.utils.formatUnits(rewardRatePerMonth)
        console.log('[uniswap] rewardRatePerMonthDecimal:', rewardRatePerMonthDecimal)
        return (
            <>
                <p>
                    Reward rate: {Number(rewardRatePerMonthDecimal).toLocaleString()} <code className="font-mono">$ELIMU</code>/month
                </p>
                <p>
                    Deposits: {depositReservesElimu.toLocaleString()} <code>$ELIMU</code> ({depositPercentage.toFixed(2)}%)
                </p>
                <p>
                    Annual percentage yield: <b>{(Number(rewardRatePerMonthDecimal) * 12 * 100 / depositReservesElimu).toFixed(2)}%</b>
                </p>
            </>
        )
    }
}

function LiquidityPoolReserves({ depositPercentage }: any) {
    console.log('[uniswap] LiquidityPoolReserves')

    const { data, isError, isLoading } = useReadContract({
        address: '0xa0d230dca71a813c68c278ef45a7dac0e584ee61',
        abi: UniswapV2Pair.abi,
        functionName: 'getReserves'
    })
    console.log('[uniswap] data:', data)
    console.log('[uniswap] isError:', isError)
    console.log('[uniswap] isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading pool token reserves</Alert>
    } else {
        const poolReserves: any = data
        let poolReservesElimu: BigNumberish = BigInt((0))
        poolReservesElimu = poolReserves[1]
        console.log('[uniswap] poolReservesElimu:', poolReservesElimu)
        const poolReservesElimuDecimal: number = Number(ethers.utils.formatEther(poolReservesElimu))
        const depositReservesElimu = Math.round(poolReservesElimuDecimal * depositPercentage / 100)
        return <RewardRate depositPercentage={depositPercentage} depositReservesElimu={depositReservesElimu} />
    }
}

function PoolTokenDepositPercentage({ totalSupply }: any) {
    console.log('[uniswap] PoolTokenDepositPercentage')

    const { data, isError, isLoading } = useReadContract({
        address: '0xa0d230dca71a813c68c278ef45a7dac0e584ee61',
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: ['0x6ba828e01713cef8ab59b64198d963d0e42e0aea']
    })
    console.log('[uniswap] data:', data)
    console.log('[uniswap] isError:', isError)
    console.log('[uniswap] isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading balance of pool token deposits</Alert>
    } else {
        const depositPercentage = Number(data) * 100 / Number(totalSupply)
        console.log('[uniswap] depositPercentage:', depositPercentage)
        return <LiquidityPoolReserves depositPercentage={depositPercentage} />
    }
}

function PoolTokenTotalSupply() {
    console.log('[uniswap] PoolTokenTotalSupply')

    const { data, isError, isLoading } = useReadContract({
        address: '0xa0d230dca71a813c68c278ef45a7dac0e584ee61',
        abi: erc20Abi,
        functionName: 'totalSupply'
    })
    console.log('[uniswap] data:', data)
    console.log('[uniswap] isError:', isError)
    console.log('[uniswap] isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading total supply of pool tokens</Alert>
    } else {
        return <PoolTokenDepositPercentage totalSupply={data} />
    }
}

export default function RewardDetails() {
    console.log('[uniswap] RewardDetails')

    return <PoolTokenTotalSupply />
}
