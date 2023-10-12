import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import SushiSwapLPToken from '../../abis/SushiSwapLPToken.json'
import SushiSwapPoolRewards from '../../abis/SushiSwapPoolRewards.json'
import { useIsMounted } from "../../hooks/useIsMounted"
import { Alert } from "@mui/material"
import Link from "next/link"
import { BigNumberish, ethers } from "ethers"
import { useState } from "react"

function DepositButton({ amountGwei }: any) {
    console.log('DepositButton')

    const { config: prepareConfig, isError: prepareIsError, error: prepareError, isLoading: prepareIsLoading } = usePrepareContractWrite({
        address: '0x92bC866Ff845a5050b3C642Dec94E5572305872f',
        abi: SushiSwapPoolRewards.abi,
        functionName: 'depositPoolTokens',
        args: [amountGwei]
    })
    console.log('prepareConfig:', prepareConfig)
    console.log('prepareIsError:', prepareIsError)
    console.log('prepareError:', prepareError)
    console.log('prepareIsLoading:', prepareIsLoading)

    const { data: writeData, write, isLoading: writeIsLoading, isSuccess: writeIsSuccess } = useContractWrite(prepareConfig)
    console.log('writeData:', writeData)
    console.log('write:', write)
    console.log('writeIsLoading:', writeIsLoading)
    console.log('writeIsSuccess:', writeIsSuccess)

    const { data: waitForTransactionData, isError: waitForTransactionIsError, error: waitForTransactionError, isLoading: waitForTransactionIsLoading, isSuccess: waitForTransactionIsSuccess } = useWaitForTransaction({
        hash: writeData?.hash
    })
    console.log('waitForTransactionData:', waitForTransactionData)
    console.log('waitForTransactionIsError:', waitForTransactionIsError)
    console.log('waitForTransactionError:', waitForTransactionError)
    console.log('waitForTransactionIsLoading:', waitForTransactionIsLoading)
    console.log('waitForTransactionIsSuccess:', waitForTransactionIsSuccess)

    return (
        <>
            <button 
                id="depositButton"
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
                disabled={!write || prepareIsLoading || writeIsLoading || waitForTransactionIsLoading}
                onClick={() => write?.()}
            >
                {(prepareIsLoading || writeIsLoading || waitForTransactionIsLoading) && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
                )} Deposit $SLP pool tokens
            </button>
            {prepareIsError && (
                <Alert severity="error" className="mt-4 justify-center">Error: {prepareError?.message}</Alert>
            )}
            {writeIsLoading && (
                <Alert severity="info" className="mt-4 justify-center">Check wallet</Alert>
            )}
            {waitForTransactionIsLoading && (
                <Alert severity="info" className="mt-4 justify-center">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span> Confirming transaction...<br />
                    <Link href={`https://etherscan.io/tx/${writeData?.hash}`} target='_blank' className="text-purple-600">
                        View on Etherscan
                    </Link>
                </Alert>
            )}
            {waitForTransactionIsSuccess && (
                <Alert severity="success" className="mt-4 justify-center">
                    Success! 🎉<br />
                    <Link href={`https://etherscan.io/tx/${writeData?.hash}`} target='_blank' className="text-purple-600">
                        View on Etherscan
                    </Link>
                </Alert>
            )}
        </>
    )
}

function AllowanceButton({ allowanceGwei }: any) {
    console.log('AllowanceButton')

    const { config: prepareConfig, isError: prepareIsError, error: prepareError, isLoading: prepareIsLoading } = usePrepareContractWrite({
        address: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
        abi: SushiSwapLPToken.abi,
        functionName: 'approve',
        args: ['0x92bC866Ff845a5050b3C642Dec94E5572305872f', allowanceGwei]
    })
    console.log('prepareConfig:', prepareConfig)
    console.log('prepareIsError:', prepareIsError)
    console.log('prepareError:', prepareError)
    console.log('prepareIsLoading:', prepareIsLoading)

    const { data: writeData, write, isLoading: writeIsLoading, isSuccess: writeIsSuccess } = useContractWrite(prepareConfig)
    console.log('writeData:', writeData)
    console.log('write:', write)
    console.log('writeIsLoading:', writeIsLoading)
    console.log('writeIsSuccess:', writeIsSuccess)

    const { data: waitForTransactionData, isError: waitForTransactionIsError, error: waitForTransactionError, isLoading: waitForTransactionIsLoading, isSuccess: waitForTransactionIsSuccess } = useWaitForTransaction({
        hash: writeData?.hash
    })
    console.log('waitForTransactionData:', waitForTransactionData)
    console.log('waitForTransactionIsError:', waitForTransactionIsError)
    console.log('waitForTransactionError:', waitForTransactionError)
    console.log('waitForTransactionIsLoading:', waitForTransactionIsLoading)
    console.log('waitForTransactionIsSuccess:', waitForTransactionIsSuccess)

    if (waitForTransactionIsSuccess) {
        return <DepositButton amountGwei={allowanceGwei} />
    }
    return (
        <>
            <button 
                id="allowanceButton"
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
                disabled={!write || prepareIsLoading || writeIsLoading || waitForTransactionIsLoading}
                onClick={() => write?.()}
            >
                {(prepareIsLoading || writeIsLoading || waitForTransactionIsLoading) && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
                )} Approve $SLP allowance
            </button>
            {prepareIsError && (
                <Alert severity="error" className="mt-4 justify-center">Error: {prepareError?.message}</Alert>
            )}
            {writeIsLoading && (
                <Alert severity="info" className="mt-4 justify-center">Check wallet</Alert>
            )}
            {waitForTransactionIsLoading && (
                <Alert severity="info" className="mt-4 justify-center">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span> Confirming transaction...<br />
                    <Link href={`https://etherscan.io/tx/${writeData?.hash}`} target='_blank' className="text-purple-600">
                        View on Etherscan
                    </Link>
                </Alert>
            )}
        </>
    )
}

function InputDepositAmount({ address, poolTokenBalance, currentAllowanceGwei }: any) {
    console.log('InputDepositAmount')
    console.log('currentAllowanceGwei:', currentAllowanceGwei)

    const [allowance, setAllowance] = useState(0)
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

function ReadAllowance({ address, poolTokenBalance }: any) {
    console.log('ReadAllowance')

    // Lookup current pool token allowance
    const { data, isError, error, isLoading } = useContractRead({
        address: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
        functionName: 'allowance',
        args: [address, '0x6ba828e01713cef8ab59b64198d963d0e42e0aea']
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('error:', error)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
        return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
    } else {
        const allowance: BigNumberish = BigInt(Number(data))
        console.log('allowance:', allowance)
        return <InputDepositAmount address={address} poolTokenBalance={poolTokenBalance} currentAllowanceGwei={allowance} />
    }
}

export default function DepositPoolTokensFlow({ address }: any) {
    console.log('DepositPoolTokensFlow')

    // Check if the address has any pool tokens available for deposit
    const { data, isError, error, isLoading } = useContractRead({
        address: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A',
        abi: SushiSwapLPToken.abi,
        functionName: 'balanceOf',
        args: [address]
    })
    console.log('data:', data)
    console.log('isError:', isError)
    console.log('error:', error)
    console.log('isLoading:', isLoading)

    if (!useIsMounted() || isLoading) {
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
        const poolTokenBalance: BigNumberish = BigInt(Number(data))
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
