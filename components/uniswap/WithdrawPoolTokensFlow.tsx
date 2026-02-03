import { useReadContract, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import UniswapPoolRewards from '../../abis/UniswapPoolRewards.json'
import { useIsMounted } from '../../hooks/useIsMounted'
import { Alert } from '@mui/material'
import Link from 'next/link'
import { BigNumberish } from 'ethers'

type WithdrawFunction = 'withdrawPoolTokens' | 'withdrawPoolTokensAndClaimReward'

type WithdrawButtonProps = {
  functionName: WithdrawFunction
  label: string
}

/** Render a single Uniswap withdraw action button with status feedback. */
function WithdrawButton({ functionName, label }: WithdrawButtonProps) {
  const { data: simulateData, isError: prepareIsError, error: prepareError, isLoading: prepareIsLoading } = useSimulateContract({
    address: '0x6ba828e01713cef8ab59b64198d963d0e42e0aea',
    abi: UniswapPoolRewards.abi,
    functionName
  })

  const { data: writeData, writeContract, isPending: writeIsPending, isSuccess: writeIsSuccess } = useWriteContract()

  const {
    isError: waitForTransactionIsError,
    error: waitForTransactionError,
    isLoading: waitForTransactionIsLoading,
    isSuccess: waitForTransactionIsSuccess
  } = useWaitForTransactionReceipt({
    hash: writeData
  })

  /** Trigger the withdraw write only when the simulation produced a request. */
  const handleClick = () => {
    if (!simulateData?.request) {
      return
    }
    writeContract(simulateData.request)
  }

  return (
    <>
      <button
        className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50"
        disabled={!simulateData?.request || prepareIsLoading || writeIsPending || waitForTransactionIsLoading}
        onClick={handleClick}
      >
        {(prepareIsLoading || writeIsPending || waitForTransactionIsLoading) && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
        )}{' '}
        {label}
      </button>
      {prepareIsError && (
        <Alert severity="error" className="mt-4 justify-center">Error: {prepareError?.message}</Alert>
      )}
      {writeIsPending && (
        <Alert severity="info" className="mt-4 justify-center">Check wallet</Alert>
      )}
      {waitForTransactionIsLoading && (
        <Alert severity="info" className="mt-4 justify-center">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>{' '}
          Confirming transaction...<br />
          <Link href={`https://etherscan.io/tx/${writeData}`} target="_blank" className="text-purple-600">
            View on Etherscan
          </Link>
        </Alert>
      )}
      {waitForTransactionIsError && (
        <Alert severity="error" className="mt-4 justify-center">Error: {waitForTransactionError?.message}</Alert>
      )}
      {waitForTransactionIsSuccess && writeIsSuccess && (
        <Alert severity="success" className="mt-4 justify-center">
          Success! 🎉<br />
          <Link href={`https://etherscan.io/tx/${writeData}`} target="_blank" className="text-purple-600">
            View on Etherscan
          </Link>
        </Alert>
      )}
    </>
  )
}

/** Render Uniswap withdraw actions based on the connected wallet balance. */
export default function WithdrawPoolTokensFlow({ address }: any) {
  const isMounted = useIsMounted()
  const { data, isError, isLoading } = useReadContract({
    address: '0x6ba828e01713cef8ab59b64198d963d0e42e0aea',
    abi: UniswapPoolRewards.abi,
    functionName: 'poolTokenBalances',
    args: [address]
  })

  if (!isMounted || isLoading) {
    return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
  }

  if (!address || data == undefined || isError) {
    return (
      <>
        <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50" disabled>
          Withdraw pool tokens
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50" disabled>
          Withdraw + claim rewards
        </button>
      </>
    )
  }

  const poolTokenDeposits: BigNumberish = BigInt(data.toString())
  if (poolTokenDeposits == BigInt(0)) {
    return (
      <>
        <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50" disabled>
          Withdraw pool tokens
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full mt-4 p-4 disabled:opacity-50" disabled>
          Withdraw + claim rewards
        </button>
      </>
    )
  }

  return (
    <>
      <WithdrawButton functionName="withdrawPoolTokens" label="Withdraw pool tokens" />
      <WithdrawButton functionName="withdrawPoolTokensAndClaimReward" label="Withdraw + claim rewards" />
    </>
  )
}
