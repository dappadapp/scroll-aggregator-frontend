import { useMemo } from 'react'
import { useNetwork } from 'wagmi'
import { ChainId, NativeCurrency } from '@/types'
import { Native } from '@/constants/tokens/native'

export default function useNativeCurrency(): NativeCurrency {
  const { chain } = useNetwork()
  return useMemo(() => {
    if( chain )
      return Native.onChain(534352 || chain.id)
    return Native.onChain(ChainId.SCROLL_MAINNET)
  }, [chain])
}
