import { ChainId } from '@/types'
// import { bscTokens } from './bsc'
// import { bscTestnetTokens } from './bsc-testnet'
// import { ethereumTokens } from './mainnet'
// import { goerliTestnetTokens } from './goerli-testnet'
// import { zksyncTokens } from './zksync'
// import { zkSyncTestnetTokens } from './zksync-testnet'
import { scrollSepoliaTokens } from './scroll-sepolia'
import { scrollMainnetTokens } from './scroll-mainnet'

const Tokens = {
  // [ChainId.ETHEREUM]: ethereumTokens,
  // [ChainId.BSC]: bscTokens,
  // [ChainId.BSC_TESTNET]: bscTestnetTokens,
  // [ChainId.GOERLI]: goerliTestnetTokens,
  // [ChainId.ZKSYNC]: zksyncTokens,
  // [ChainId.ZKSYNC_TESTNET]: zkSyncTestnetTokens,
  // [ChainId.SCROLL_TESTNET]: scrollTestnetTokens,
  [ChainId.SCROLL_SEPOLIA]: scrollSepoliaTokens,
  [ChainId.SCROLL_MAINNET]: scrollMainnetTokens,
}

export default Tokens;