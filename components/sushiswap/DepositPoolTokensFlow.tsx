import { useReadContract, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from "wagmi"
import SushiSwapLPToken from '../../abis/SushiSwapLPToken.json'
import SushiSwapPoolRewards from '../../abis/SushiSwapPoolRewards.json'
import { useIsMounted } from "../../hooks/useIsMounted"
import { Alert } from "@mui/material"
import Link from "next/link"
import { BigNumberish } from "ethers"
import { useState } from "react"

/** Render a SushiSwap deposit button for the specified pool token amount. */
function DepositButton({ amountGwei }: any) {
    console.log('DepositButton')

    const { data: simulateData, isError: prepareIsError, error: prepareError, isLoading: prepareIsLoading } = useSimulateContract({
        address: '0x92bC866Ff845a5050b3C642Dec94E5572305872f',
        abi: SushiSwapPoolRewards.abi,
        functionName: 'depositPoolTokens',
        args: [amountGwei]
    })
    console.log('simulateData:', simulateData)
    console.log('prepareIsError:', prepareIsError)
    console.log('prepareError:', prepareError)
    console.log('prepareIsLoading:', prepareIsLoading)

    const { data: writeData, writeContract, isPending: writeIsPending, isSuccess: writeIsSuccess } = useWriteContract()
    console.log('writeData:', writeData)
    console.log('writeContract:', writeContract)
    console.log('writeIsPending:', writeIsPending)
    console.log('writeIsSuccess:', writeIsSuccess)

    const { data: waitForTransactionData, isError: waitForTransactionIsError, error: waitForTransactionError, isLoading: waitForTransactionIsLoading, isSuccess: waitForTransactionIsSuccess } = useWaitForTransactionReceipt({
        hash: writeData
    })
    console.log('waitForTransactionData:', waitForTransactionData)
    console.log('waitForTransactionIsError:', waitForTransactionIsError)
    console.log('waitForTransactionError:', waitForTransactionError)
    console.log('waitForTransactionIsLoading:', waitForTransactionIsLoading)
    console.log('waitForTransactionIsSuccess:', waitForTransactionIsSuccess)

    /** Trigger the deposit write only when the simulation produced a request. */
    const handleClick = () => {
        if (!simulateData?.request) {
            return
        }
        writeContract(simulateData.request)
    }

    return (
        <>
            <button 
                id="depositButton"
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
                disabled={!simulateData?.request || prepareIsLoading || writeIsPending || waitForTransactionIsLoading}
                onClick={handleClick}
            >
                {(prepareIsLoading || writeIsPending || waitForTransactionIsLoading) && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
                )} Deposit $SLP pool tokens
            </button>
            {prepareIsError && (
                <Alert severity="error" className="mt-4 justify-center">Error: {prepareError?.message}</Alert>
            )}
            {writeIsPending && (
                <Alert severity="info" className="mt-4 justify-center">Check wallet</Alert>
            )}
            {waitForTransactionIsLoading && (
                <Alert severity="info" className="mt-4 justify-center">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span> Confirming transaction...<br />
                    <Link href={`https://etherscan.io/tx/${writeData}`} target='_blank' className="text-purple-600">
                        View on Etherscan
                    </Link>
                </Alert>
            )}
            {waitForTransactionIsSuccess && (
                <Alert severity="success" className="mt-4 justify-center">
                    Success! 🎉<br />
                    <Link href={`https://etherscan.io/tx/${writeData}`} target='_blank' className="text-purple-600">
                        View on Etherscan
                    </Link>
                </Alert>
            )}
        </>
    )
}

/** Render a SushiSwap allowance approval button for the specified allowance amount. */
function AllowanceButton({ allowanceGwei }: any) {
    console.log('AllowanceButton')

    const { data: simulateData, isError: prepareIsError, error: prepareError, isLoading: prepareIsLoading } = useSimulateContract({
        address: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
        abi: SushiSwapLPToken.abi,
        functionName: 'approve',
        args: ['0x92bC866Ff845a5050b3C642Dec94E5572305872f', allowanceGwei]
    })
    console.log('simulateData:', simulateData)
    console.log('prepareIsError:', prepareIsError)
    console.log('prepareError:', prepareError)
    console.log('prepareIsLoading:', prepareIsLoading)

    const { data: writeData, writeContract, isPending: writeIsPending, isSuccess: writeIsSuccess } = useWriteContract()
    console.log('writeData:', writeData)
    console.log('writeContract:', writeContract)
    console.log('writeIsPending:', writeIsPending)
    console.log('writeIsSuccess:', writeIsSuccess)

    const { data: waitForTransactionData, isError: waitForTransactionIsError, error: waitForTransactionError, isLoading: waitForTransactionIsLoading, isSuccess: waitForTransactionIsSuccess } = useWaitForTransactionReceipt({
        hash: writeData
    })
    console.log('waitForTransactionData:', waitForTransactionData)
    console.log('waitForTransactionIsError:', waitForTransactionIsError)
    console.log('waitForTransactionError:', waitForTransactionError)
    console.log('waitForTransactionIsLoading:', waitForTransactionIsLoading)
    console.log('waitForTransactionIsSuccess:', waitForTransactionIsSuccess)

    /** Trigger the approval write only when the simulation produced a request. */
    const handleClick = () => {
        if (!simulateData?.request) {
            return
        }
        writeContract(simulateData.request)
    }

    if (waitForTransactionIsSuccess) {
        return <DepositButton amountGwei={allowanceGwei} />
    }
    return (
        <>
            <button 
                id="allowanceButton"
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
                disabled={!simulateData?.request || prepareIsLoading || writeIsPending || waitForTransactionIsLoading}
                onClick={handleClick}
            >
                {(prepareIsLoading || writeIsPending || waitForTransactionIsLoading) && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
                )} Approve $SLP allowance
            </button>
            {prepareIsError && (
                <Alert severity="error" className="mt-4 justify-center">Error: {prepareError?.message}</Alert>
            )}
            {writeIsPending && (
                <Alert severity="info" className="mt-4 justify-center">Check wallet</Alert>
            )}
            {waitForTransactionIsLoading && (
                <Alert severity="info" className="mt-4 justify-center">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span> Confirming transaction...<br />
                    <Link href={`https://etherscan.io/tx/${writeData}`} target='_blank' className="text-purple-600">
                        View on Etherscan
                    </Link>
                </Alert>
            )}
        </>
    )
}

/** Render the allowance input and conditionally show approval or deposit actions. */
function InputDepositAmount({ address, poolTokenBalance, currentAllowanceGwei }: any) {
    console.log('InputDepositAmount')
    console.log('currentAllowanceGwei:', currentAllowanceGwei)

    const [allowance, setAllowance] = useState(0)
    /** Keep allowance input value in local state. */
    const handleAllowanceChange = (event: any) => {
        console.log('handleAllowanceChange')
        setAllowance(event.target.value)
    }
    console.log('allowance:', allowance)
    const allowanceGwei: BigNumberish = allowance * 1e18
    console.log('allowanceGwei:', allowanceGwei)

    return (
        <>
            <input
                id="allowanceInput"
                onChange={handleAllowanceChange}
                type="number"
                placeholder="Amount"
                className="input font-mono text-lg w-full p-4 border border-solid border-gray-300 shadow-inner rounded-full text-center"
            />
            {(allowanceGwei <= 0) ? (
                <button 
                        id="depositButton"
                        className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
                        disabled>
                    Deposit $SLP pool tokens
                </button>
            ) : (
                (allowanceGwei > currentAllowanceGwei) ? (
                    <AllowanceButton allowanceGwei={allowanceGwei} />
                ) : (
                    <DepositButton amountGwei={allowanceGwei} />
                )
            )}
        </>
    )
}

/** Load the current allowance and show the deposit input flow. */
function ReadAllowance({ address, poolTokenBalance }: any) {
    console.log('ReadAllowance')

    const isMounted = useIsMounted()

    // Lookup current pool token allowance
    const { data, isError, error, isLoading } = useReadContract({
        address: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
        abi: SushiSwapLPToken.abi,
        functionName: 'allowance',
        args: [address, '0x92bC866Ff845a5050b3C642Dec94E5572305872f']
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('error:', error)
    console.log('isLoading:', isLoading)

    if (!isMounted || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else {
        const allowance: BigNumberish = BigInt(data.toString())
        console.log('allowance:', allowance)
        return <InputDepositAmount address={address} poolTokenBalance={poolTokenBalance} currentAllowanceGwei={allowance} />
    }
}

/** Render the SushiSwap pool token deposit flow for the connected wallet. */
export default function DepositPoolTokensFlow({ address }: any) {
    console.log('DepositPoolTokensFlow')

    const isMounted = useIsMounted()

    // Check if the address has any pool tokens available for deposit
    const { data, isError, error, isLoading } = useReadContract({
        address: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
        abi: SushiSwapLPToken.abi,
        functionName: 'balanceOf',
        args: [address]
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('error:', error)
    console.log('isLoading:', isLoading)

    if (!isMounted || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else if (!address || (data == undefined)) {
        return (
            <>
                <input
                    id="depositInput"
                    type="number"
                    placeholder="Amount"
                    className="input w-full p-4 border border-solid border-gray-300 shadow-inner rounded-full text-center"
                    disabled />
                <button 
                    id="depositButton"
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
                    disabled>
                    Deposit $SLP pool tokens
                </button>
            </>
        )
    } else {
        const poolTokenBalance: BigNumberish = BigInt(data.toString())
        console.log('poolTokenBalance:', poolTokenBalance)
        if (poolTokenBalance == BigInt(0)) {
            return (
                <>
                    <input
                        id="depositInput"
                        type="number"
                        placeholder="Amount"
                        className="input w-full p-4 border border-solid border-gray-300 shadow-inner rounded-full text-center"
                        disabled />
                    <button 
                        id="depositButton"
                        className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
                        disabled>
                        Deposit $SLP pool tokens
                    </button>
                </>
            )
        } else {
            return <ReadAllowance address={address} poolTokenBalance={poolTokenBalance} />
        }
    }
}
