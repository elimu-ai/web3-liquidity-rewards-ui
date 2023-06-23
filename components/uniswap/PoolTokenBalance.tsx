import { useContractRead } from 'wagmi'
import UniswapV2Pair from '../../abis/UniswapV2Pair.json'
import { useIsMounted } from '../../hooks/useIsMounted'
import { Alert } from '@mui/material'
import { BigNumber, BigNumberish, ethers } from 'ethers'

export default function PoolTokenBalance({ address }: any) {
    console.log('PoolTokenBalance')

    const { data, isError, isLoading } = useContractRead({
        address: '0xa0d230dca71a813c68c278ef45a7dac0e584ee61',
        abi: UniswapV2Pair.abi,
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
    } else if (data == undefined) {
        return <Alert severity="error" className='mt-4 justify-center'>Error loading pool token balance</Alert>
    } else {
        const poolTokenBalance: BigNumberish = BigInt(Number(data))
        console.log('poolTokenBalance:', poolTokenBalance)
        return (
            <>
                {Number(ethers.utils.formatUnits(poolTokenBalance)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $UNI-V2
            </>
        )
    }
}
