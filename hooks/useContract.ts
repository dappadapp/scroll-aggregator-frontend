import { useMemo } from 'react'
import { useNetwork } from 'wagmi'
import { aggregator } from '@/constants/contracts'

export default function useContract() {
  const { chain } = useNetwork()
  return useMemo(() => {
    if( chain )
      return aggregator[`${chain.id}`]
    return undefined
  }, [chain])
}
