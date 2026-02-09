import { useReadContract, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from "wagmi"
import SushiSwapPoolRewards from '../../abis/SushiSwapPoolRewards.json'
import { useIsMounted } from "../../hooks/useIsMounted"
import { Alert } from "@mui/material"
import Link from "next/link"
import { BigNumberish } from "ethers"

/** Render the claim button and transaction feedback for SushiSwap rewards. */
function PrepareClaimReward({ address }: any) {
  console.log('PrepareClaimReward')

  const isMounted = useIsMounted()

  const { data: simulateData, isError: prepareIsError, error: prepareError, isLoading: prepareIsLoading } = useSimulateContract({
    address: '0x92bC866Ff845a5050b3C642Dec94E5572305872f',
    abi: SushiSwapPoolRewards.abi,
    functionName: 'claimReward'
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

  /** Trigger the claim write only when the simulation produced a request. */
  const handleClick = () => {
    if (!simulateData?.request) {
      return
    }
    writeContract(simulateData.request)
  }

  if (!isMounted || prepareIsLoading) {
    return (
      <button 
          id="claimButton"
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 disabled:opacity-50"
          disabled
      >
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span> Preparing...
      </button>
    )
  } else if (prepareIsError) {
    return (
      <>
        <button 
            id="claimButton"
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 disabled:opacity-50"
            disabled
        >
          Preparing...
        </button>
        <Alert severity="error" className="mt-4 justify-center">Error: {prepareError?.message}</Alert>
      </>
    )
  } else {
    const isReadyToClaim = !!simulateData?.request && !writeIsPending
    const buttonLabel = writeIsPending ? 'Confirming...' : 'Preparing...'

    return (
      !writeIsSuccess ? (
        isReadyToClaim ? (
          <button 
              id="claimButton"
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 disabled:opacity-50"
              disabled={!simulateData?.request}
              onClick={handleClick}
          >
            Claim rewards
          </button>
        ) : (
          <>
            <button 
                id="claimButton"
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 disabled:opacity-50"
                disabled
            >
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span> {buttonLabel}
            </button>
            {writeIsPending && (
              <Alert severity="info" className="mt-4 justify-center">Check wallet</Alert>
            )}
          </>
        )
      ) : (
       waitForTransactionIsLoading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span> Confirming transaction...
            <Alert severity="info" className="mt-4 justify-center">
              <Link href={`https://etherscan.io/tx/${writeData}`} target='_blank' className="text-purple-600">
                View on Etherscan
              </Link>
            </Alert>
          </>
        ) : (
          !waitForTransactionIsSuccess ? (
            <Alert severity="error" className="mt-4 justify-center">Error: {waitForTransactionError?.message}</Alert>
          ) : (
            <>
              Success! 🎉
              <Alert severity="success" className="mt-4 justify-center">
                <Link href={`https://etherscan.io/tx/${writeData}`} target='_blank' className="text-purple-600">
                  View on Etherscan
                </Link>
              </Alert>
            </>
          )
        )
      )
    )
  }
}

/** Render the SushiSwap rewards claim flow for the connected wallet. */
export default function ClaimRewardsFlow({ address }: any) {
  console.log('ClaimRewardsFlow')

  const isMounted = useIsMounted()

  const { data, isError, isLoading } = useReadContract({
    address: '0x92bC866Ff845a5050b3C642Dec94E5572305872f',
    abi: SushiSwapPoolRewards.abi,
    functionName: 'claimableReward',
    args: [address]
  })
  console.log('data:', data)
  console.log('isError:', isError)
  console.log('isLoading:', isLoading)

  if (!isMounted || isLoading) {
    return <span className="inline-block h-4 w-4 animate-spin rounded-full border-8 border-purple-500 border-r-transparent"></span>
  } else if (!address || (data == undefined)) {
    return (
      <button 
          id="claimButton"
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 disabled:opacity-50"
          disabled>
        Claim rewards
      </button>
    )
  } else {
    const claimableReward: BigNumberish = BigInt(data.toString())
    console.log('claimableReward:', claimableReward)
    if (claimableReward == BigInt(0)) {
      return (
        <button 
            id="claimButton"
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 disabled:opacity-50"
            disabled>
          Claim rewards
        </button>
      )
    } else {
      return <PrepareClaimReward address={address} />
    }
  }
}
