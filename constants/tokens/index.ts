import { ChainId } from '@/types'
import { bscTokens } from './bsc'
import { bscTestnetTokens } from './bsc-testnet'
import { ethereumTokens } from './mainnet'
import { goerliTestnetTokens } from './goerli-testnet'
import { zksyncTokens } from './zksync'
import { zkSyncTestnetTokens } from './zksync-testnet'
import { scrollTokens } from './scroll'
import { scrollTestnetTokens } from './scroll-testnet'

const Tokens = {
  [ChainId.ETHEREUM]: ethereumTokens,
  [ChainId.BSC]: bscTokens,
  [ChainId.BSC_TESTNET]: bscTestnetTokens,
  [ChainId.GOERLI]: goerliTestnetTokens,
  [ChainId.ZKSYNC]: zksyncTokens,
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnetTokens,
  [ChainId.SCROLL]: scrollTokens,
  [ChainId.SCROLL_TESTNET]: scrollTestnetTokens
}

export default Tokens;