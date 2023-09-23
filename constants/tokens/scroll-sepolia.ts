import { ChainId, ERC20Token } from '@/types'

import { USDT, WETH9 } from './common'

export const scrollSepoliaTokens = {
  weth: WETH9[ChainId.SCROLL_SEPOLIA],
  usdt: USDT[ChainId.SCROLL_SEPOLIA],
  tSpace: new ERC20Token(ChainId.SCROLL_SEPOLIA, '0xeFBB3810C4347f416d2A24EE37b09b466b6Eac15', 18, 'tSPACE', 'tSPACE', 'https://raw.githubusercontent.com/SpaceFinance/default-token-list/master/assets/0xACbc9652C9Cafd9D1554CCcB15Dd7D3D9A9A47bB.png'),
  gho: new ERC20Token(ChainId.SCROLL_SEPOLIA, '0xD9692f1748aFEe00FACE2da35242417dd05a8615', 18, 'GHO', 'GHO', 'https://raw.githubusercontent.com/SpaceFinance/default-token-list/master/assets/0xD9692f1748aFEe00FACE2da35242417dd05a8615.png'),
  mock: new ERC20Token(ChainId.SCROLL_SEPOLIA, '0x87225C02F104a353d7dA0708907Ec18d1e74ce27', 18, 'MOCK', 'MOCK', '/chains/scroll.svg'),
 
}
