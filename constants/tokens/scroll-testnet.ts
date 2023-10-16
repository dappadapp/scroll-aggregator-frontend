import { ChainId, ERC20Token } from '@/types'

import { USDC, WETH9 } from './common'

export const scrollTestnetTokens = {
  weth: WETH9[ChainId.SCROLL_TESTNET],
  mock: new ERC20Token(ChainId.SCROLL_TESTNET, '0x517d4662543b3bA6E034F2b30F2E40f8edAFc8d7', 18, 'MOCK', 'MOCK', ),
}
