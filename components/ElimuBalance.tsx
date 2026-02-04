import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import { useIsMounted } from '../hooks/useIsMounted'
import { BigNumberish, ethers } from 'ethers'

export default function ElimuBalance({ address }: any) {
    console.log('ElimuBalance')

    const isMounted = useIsMounted()
    const { data, isError, isLoading } = useReadContract({
        address: '0xe29797910D413281d2821D5d9a989262c8121CC2',
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address]
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('isLoading:', isLoading)

    if (!isMounted || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    }

    if (isError || data == null) {
        return <>-- $ELIMU</>
    }

    let elimuBalance: BigNumberish
    if (typeof data === 'bigint') {
        elimuBalance = data
    } else if (typeof data === 'number' && Number.isFinite(data)) {
        elimuBalance = BigInt(Math.trunc(data))
    } else if (typeof data === 'string' && data !== '') {
        elimuBalance = BigInt(data)
    } else {
        return <>-- $ELIMU</>
    }

    console.log('elimuBalance:', elimuBalance)
    return <>{Number(ethers.utils.formatUnits(elimuBalance)).toLocaleString(undefined, { maximumFractionDigits: 0 })} $ELIMU</>
}
