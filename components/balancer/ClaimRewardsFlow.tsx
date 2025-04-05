import { useContractRead, useContractWrite, useSimulateContract, useWaitForTransaction } from "wagmi"
import BalancerPoolRewards from '../../abis/BalancerPoolRewards.json'
import { useIsMounted } from "../../hooks/useIsMounted"
import { Alert } from "@mui/material"
import Link from "next/link"
import { BigNumberish } from "ethers"

function PrepareClaimReward({ address }: any) {
  console.log('PrepareClaimReward')

  const { data: simulateData, isError: prepareIsError, error: prepareError, isLoading: prepareIsLoading } = useSimulateContract  ({
    address: '0x8A1d0924Bb0d9b4Aab6508263828cA26ca0dC235',
    abi: BalancerPoolRewards.abi,
    functionName: 'claimReward'
  })
  console.log('simulateData:', simulateData)
  console.log('prepareIsError:', prepareIsError)
  console.log('prepareError:', prepareError)
  console.log('prepareIsLoading:', prepareIsLoading)

  const { data: writeData, write, isLoading: writeIsLoading, isSuccess: writeIsSuccess } = useContractWrite(simulateData)
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

  if (!useIsMounted() || prepareIsLoading) {
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
    return (
      !writeIsSuccess ? (
        (write && !writeIsLoading) ? (
          <button 
              id="claimButton"
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 disabled:opacity-50"
              disabled={!write}
              onClick={() => write()}
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
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span> Confirming...
            </button>
            <Alert severity="info" className="mt-4 justify-center">Check wallet</Alert>
          </>
        )
      ) : (
       waitForTransactionIsLoading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span> Confirming transaction...
            <Alert severity="info" className="mt-4 justify-center">
              <Link href={`https://etherscan.io/tx/${writeData?.hash}`} target='_blank' className="text-purple-600">
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
                <Link href={`https://etherscan.io/tx/${writeData?.hash}`} target='_blank' className="text-purple-600">
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

export default function ClaimRewardsFlow({ address }: any) {
  console.log('ClaimRewardsFlow')

  const { data, isError, isLoading } = useContractRead({
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
    const claimableReward: BigNumberish = BigInt(Number(data))
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
