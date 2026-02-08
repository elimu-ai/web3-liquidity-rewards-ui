import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import { useIsMounted } from '../hooks/useIsMounted'
import { BigNumberish, ethers } from 'ethers'

export default function ElimuBalance({ address }: any) {
    console.log('ElimuBalance')

    const { data, isError, isLoading } = useReadContract({
        address: '0xe29797910D413281d2821D5d9a989262c8121CC2',
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address]
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else {
        const elimuBalance: BigNumberish = BigInt(Number(data))
        console.log('elimuBalance:', elimuBalance)
        return <>{Number(ethers.utils.formatUnits(elimuBalance)).toLocaleString(undefined, { maximumFractionDigits: 0 })} $ELIMU</>
    }
}