import { ChainId, ERC20Token } from '@/types'

import { USDC, WETH9 } from './common'

export const scrollTestnetTokens = {
  weth: WETH9[ChainId.SCROLL_TESTNET],
  mock: new ERC20Token(ChainId.SCROLL_TESTNET, '0x923AD8C9183A76B1DC341F23B8822AB4f7eBf9E0', 18, 'MOCK', 'MOCK'),
}
