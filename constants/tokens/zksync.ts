import { ChainId } from '@/types'

import { USDC, WETH9 } from './common'

export const zksyncTokens = {
  weth: WETH9[ChainId.ZKSYNC],
  usdc: USDC[ChainId.ZKSYNC],
}
