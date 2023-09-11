import { useMemo } from 'react'
import { useNetwork } from 'wagmi'
import { ChainId, NativeCurrency } from '@/types'
import { Native } from '@/constants/tokens/native'

export default function useNativeCurrency(): NativeCurrency {
  const { chain } = useNetwork()
  return useMemo(() => {
    if( chain )
      return Native.onChain(chain.id)
    return Native.onChain(ChainId.BSC)
  }, [chain])
}
