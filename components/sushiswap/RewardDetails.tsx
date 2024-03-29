import { erc20ABI, useContractRead } from 'wagmi'
import SushiSwapPoolRewards from '../../abis/SushiSwapPoolRewards.json'
import SushiSwapLPToken from '../../abis/SushiSwapLPToken.json'
import { useIsMounted } from '../../hooks/useIsMounted'
import { Alert } from '@mui/material'
import { BigNumber, BigNumberish, ethers } from 'ethers'

function RewardRate({ depositPercentage, depositReservesElimu }: any) {
    console.log('RewardRate')

    const { data, isError, isLoading } = useContractRead({
        address: '0x92bC866Ff845a5050b3C642Dec94E5572305872f',
        abi: SushiSwapPoolRewards.abi,
        functionName: 'rewardRatePerSecond'
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading reward rate</Alert>
    } else {
        const rewardRatePerMonth: BigNumberish = BigInt(Number(data) * 60 * 60 * 24 * 30)
        console.log('rewardRatePerMonth:', rewardRatePerMonth)
        const rewardRatePerMonthDecimal: string = ethers.utils.formatUnits(rewardRatePerMonth)
        console.log('rewardRatePerMonthDecimal:', rewardRatePerMonthDecimal)
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
    console.log('LiquidityPoolReserves')

    const { data, isError, isLoading } = useContractRead({
        address: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
        abi: SushiSwapLPToken.abi,
        functionName: 'getReserves'
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading pool token reserves</Alert>
    } else {
        const poolReserves: any = data
        let poolReservesElimu: BigNumberish = BigInt((0))
        poolReservesElimu = poolReserves[1]
        console.log('poolReservesElimu:', poolReservesElimu)
        const poolReservesElimuDecimal: number = Number(ethers.utils.formatEther(poolReservesElimu))
        const depositReservesElimu = Math.round(poolReservesElimuDecimal * depositPercentage / 100)
        return <RewardRate depositPercentage={depositPercentage} depositReservesElimu={depositReservesElimu} />
    }
}

function PoolTokenDepositPercentage({ totalSupply }: any) {
    console.log('PoolTokenDepositPercentage')

    const { data, isError, isLoading } = useContractRead({
        address: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: ['0x92bC866Ff845a5050b3C642Dec94E5572305872f']
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
        console.log('depositPercentage:', depositPercentage)
        return <LiquidityPoolReserves depositPercentage={depositPercentage} />
    }
}

function PoolTokenTotalSupply() {
    console.log('PoolTokenTotalSupply')

    const { data, isError, isLoading } = useContractRead({
        address: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
        abi: erc20ABI,
        functionName: 'totalSupply'
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (data == undefined) {
        return <Alert severity="error">Error loading total supply of pool tokens</Alert>
    } else {
        return <PoolTokenDepositPercentage totalSupply={data} />
    }
}

export default function RewardDetails() {
    console.log('RewardDetails')

    return <PoolTokenTotalSupply />
}
