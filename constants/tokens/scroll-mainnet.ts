import { ChainId, ERC20Token } from '@/types'

import { USDT, WETH9, USDC } from './common'

export const scrollMainnetTokens = {
  weth: WETH9[ChainId.SCROLL_MAINNET],
  usdt: USDT[ChainId.SCROLL_MAINNET],
  usdc: USDC[ChainId.SCROLL_MAINNET],
}
