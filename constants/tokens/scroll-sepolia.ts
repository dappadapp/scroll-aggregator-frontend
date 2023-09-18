import { ChainId, ERC20Token } from '@/types'

import { USDC, WETH9 } from './common'

export const scrollSepoliaTokens = {
  weth: WETH9[ChainId.SCROLL_SEPOLIA],
  mock: new ERC20Token(ChainId.SCROLL_SEPOLIA, '0x87225C02F104a353d7dA0708907Ec18d1e74ce27', 18, 'MOCK', 'MOCK'),
}
