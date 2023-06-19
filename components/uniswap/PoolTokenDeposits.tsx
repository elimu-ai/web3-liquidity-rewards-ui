import { useContractRead } from 'wagmi'
import UniswapPoolRewards from '../../abis/UniswapPoolRewards.json'
import { useIsMounted } from '../../hooks/useIsMounted'
import { Alert } from '@mui/material'
import { BigNumber, BigNumberish, ethers } from 'ethers'

export default function PoolTokenDeposits({ address }: any) {
    console.log('PoolTokenDeposits')

    const { data, isError, isLoading } = useContractRead({
        address: '0x6ba828e01713cef8ab59b64198d963d0e42e0aea',
        abi: UniswapPoolRewards.abi,
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
            <Alert severity="error">Error loading pool token deposits</Alert>
        )
    } else {
        const poolTokenDeposits: BigNumberish = BigInt(Number(data))
        console.log('poolTokenDeposits:', poolTokenDeposits)
        return (
            <>
                {Number(ethers.utils.formatUnits(poolTokenDeposits)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $UNI-V2
            </>
        )
    }
}
