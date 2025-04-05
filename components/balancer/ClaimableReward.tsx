import { useReadContract } from 'wagmi'
import BalancerPoolRewards from '../../abis/BalancerPoolRewards.json'
import { useIsMounted } from '../../hooks/useIsMounted'
import { Alert } from '@mui/material'
import { BigNumberish, ethers } from 'ethers'

export default function ClaimableReward({ address }: any) {
    console.log('ClaimableReward')

    const { data, isError, isLoading } = useReadContract({
        address: '0x8A1d0924Bb0d9b4Aab6508263828cA26ca0dC235',
        abi: BalancerPoolRewards.abi,
        functionName: 'claimableReward',
        args: [address]
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (!address) {
        return <>Connect Wallet ☝🏽</>
    } else if (data == undefined) {
        return <Alert severity="error" className='mt-4 justify-center'>Error loading claimable reward</Alert>
    } else {
        const claimableReward: BigNumberish = BigInt(Number(data))
        console.log('claimableReward:', claimableReward)
        return <>{Number(ethers.utils.formatUnits(claimableReward)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $ELIMU</>
    }
}
