import { ChainId, ERC20Token } from '@/types'

import { USDT, WETH9, USDC, PUNK_TOKEN,WBTC, wsETH, script } from './common'

export const scrollMainnetTokens = {
  weth: WETH9[ChainId.SCROLL_MAINNET],
  usdc: USDC[ChainId.SCROLL_MAINNET],
  usdt: USDT[ChainId.SCROLL_MAINNET],
  punk: PUNK_TOKEN,
  wbtc: WBTC,
  //wsETH: wsETH,
  script: script

}
