import { useContractRead } from 'wagmi'
import BalancerPoolRewards from '../../abis/BalancerPoolRewards.json'
import { useIsMounted } from '../../hooks/useIsMounted'
import { Alert } from '@mui/material'
import { BigNumberish, ethers } from 'ethers'

export default function PoolTokenDeposits({ address }: any) {
    console.log('PoolTokenDeposits')

    const { data, isError, isLoading } = useContractRead({
        address: '0x8A1d0924Bb0d9b4Aab6508263828cA26ca0dC235',
        abi: BalancerPoolRewards.abi,
        functionName: 'poolTokenBalances',
        args: [address]
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
        )
    } else if (!address) {
        return (
            <>Connect Wallet ☝🏽</>
        )
    } else if (data == undefined) {
        return (
            <Alert severity="error" className='mt-4 justify-center'>Error loading pool token deposits</Alert>
        )
    } else {
        const poolTokenDeposits: BigNumberish = BigInt(Number(data))
        console.log('poolTokenDeposits:', poolTokenDeposits)
        return (
            <>
                {Number(ethers.utils.formatUnits(poolTokenDeposits)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $20WETH-80ELIMU
            </>
        )
    }
}
