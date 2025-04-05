import { erc20ABI, useContractRead } from 'wagmi'
import BalancerPoolRewards from '../../abis/BalancerPoolRewards.json'
import BalancerVault from '../../abis/BalancerVault.json'
import { useIsMounted } from '../../hooks/useIsMounted'
import { Alert } from '@mui/material'
import { BigNumberish, ethers } from 'ethers'

function RewardRate({ depositPercentage, depositReservesElimu }: any) {
    console.log('[balancer] RewardRate')

    const { data, isError, isLoading } = useContractRead({
        address: '0x8A1d0924Bb0d9b4Aab6508263828cA26ca0dC235',
        abi: BalancerPoolRewards.abi,
        functionName: 'rewardRatePerSecond'
    })
    console.log('[balancer] data:', data)
    console.log('[balancer] isError:', isError)
    console.log('[balancer] isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading reward rate</Alert>
    } else {
        const rewardRatePerMonth: BigNumberish = BigInt(Number(data) * 60 * 60 * 24 * 30)
        console.log('[balancer] rewardRatePerMonth:', rewardRatePerMonth)
        const rewardRatePerMonthDecimal: string = ethers.utils.formatUnits(rewardRatePerMonth)
        console.log('[balancer] rewardRatePerMonthDecimal:', rewardRatePerMonthDecimal)
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
    console.log('[balancer] LiquidityPoolReserves')

    const { data, isError, isLoading } = useContractRead({
        address: '0xba12222222228d8ba445958a75a0704d566bf2c8',
        abi: BalancerVault.abi,
        functionName: 'getPoolTokens',
        args: ['0x517390b2b806cb62f20ad340de6d98b2a8f17f2b0002000000000000000001ba']
    })
    console.log('[balancer] data:', data)
    console.log('[balancer] isError:', isError)
    console.log('[balancer] isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading pool token reserves</Alert>
    } else {     
        const poolTokenHoldings: any = data
        let poolTokenHoldingsElimu: BigNumberish = BigInt((0))
        poolTokenHoldingsElimu = poolTokenHoldings[1][1]
        console.log('[balancer] poolTokenHoldingsElimu:', poolTokenHoldingsElimu)
        const poolReservesElimuDecimal: number = Number(ethers.utils.formatEther(poolTokenHoldingsElimu ))
        const depositReservesElimu = Math.round(poolReservesElimuDecimal * depositPercentage / 100)
        return <RewardRate depositPercentage={depositPercentage} depositReservesElimu={depositReservesElimu} />
    }
}

function PoolTokenDepositPercentage({ totalSupply }: any) {
    console.log('[balancer] PoolTokenDepositPercentage')

    const { data, isError, isLoading } = useContractRead({
        address: '0x517390b2B806cb62f20ad340DE6d98B2A8F17F2B',
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: ['0x8A1d0924Bb0d9b4Aab6508263828cA26ca0dC235']
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading balance of pool token deposits</Alert>
    } else {
        const depositPercentage = Number(data) * 100 / Number(totalSupply)
        console.log('[balancer] depositPercentage:', depositPercentage)
        return <LiquidityPoolReserves depositPercentage={depositPercentage} />
    }
}

function PoolTokenTotalSupply() {
    console.log('[balancer] PoolTokenTotalSupply')

    const { data, isError, error, isLoading } = useContractRead({
        address: '0x517390b2B806cb62f20ad340DE6d98B2A8F17F2B',
        abi: erc20ABI,
        functionName: 'totalSupply'
    })
    console.log('[balancer] data:', data)
    console.log('[balancer] isError:', isError)
    console.log('[balancer] error:', error)
    console.log('[balancer] isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading total supply of pool tokens</Alert>
    } else {
        return <PoolTokenDepositPercentage totalSupply={data} />
    }
}

export default function RewardDetails() {
    console.log('[balancer] RewardDetails')

    return <PoolTokenTotalSupply />
}
