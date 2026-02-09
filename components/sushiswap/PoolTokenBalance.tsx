import { useReadContract } from 'wagmi'
import SushiSwapLPToken from '../../abis/SushiSwapLPToken.json'
import { useIsMounted } from '../../hooks/useIsMounted'
import { Alert } from '@mui/material'
import { BigNumber, BigNumberish, ethers } from 'ethers'

export default function PoolTokenBalance({ address }: any) {
    console.log('PoolTokenBalance')

    const { data, isError, isLoading } = useReadContract({
        address: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
        abi: SushiSwapLPToken.abi,
        functionName: 'balanceOf',
        args: [address]
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (!address) {
        return <>Connect Wallet ☝🏽</>
    } else if (isError || data == undefined) {
        return <Alert severity="error" className='mt-4 justify-center'>Error loading pool token balance</Alert>
    } else {
        const poolTokenBalance: BigNumberish = BigInt(Number(data))
        console.log('poolTokenBalance:', poolTokenBalance)
        return (
            <>
                {Number(ethers.utils.formatUnits(poolTokenBalance)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $SLP
            </>
        )
    }
}
