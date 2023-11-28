import { mainnet, goerli, bsc, bscTestnet, scrollSepolia, scrollTestnet, zkSync, zkSyncTestnet, scroll } from "wagmi/chains";

export * from './token'

import Skydrome from '@/assets/images/skydrome.png';
import { Token } from "./token";

export enum ChainId {
  ETHEREUM = mainnet.id,
  GOERLI = goerli.id,
  BSC = bsc.id,
  BSC_TESTNET = bscTestnet.id,
  ZKSYNC = zkSync.id,
  ZKSYNC_TESTNET = zkSyncTestnet.id,
  SCROLL_TESTNET = scrollTestnet.id,
  SCROLL_SEPOLIA = scrollSepolia.id,
  SCROLL_MAINNET = scroll.id,
}

export enum SWAP_TYPE {
  SPACEFI = 1,
  SKYDROME = 2,
  IZUMI = 3,
  SYNCSWAP = 4,
  PUNKSWAP = 5,
  KYBERSWAP = 6,
  COFFEESWAP = 7,
  PAPYRUSSWAP = 8,
  SUSHISWAP = 9,
  
  INVALID = 0,
}
interface SwapTypeInfo {
  name: string;
  icon: string;
}


export const swapTypeMapping: Record<SWAP_TYPE, SwapTypeInfo> = {
  [SWAP_TYPE.SPACEFI]: {
    name: 'SpaceFi',
    icon: 'https://raw.githubusercontent.com/SpaceFinance/default-token-list/master/assets/0x4E2D4F33d759976381D9DeE04B197bF52F6bC1FC.png',
  },
  [SWAP_TYPE.SKYDROME]: {
    name: 'Skydrome',
    icon: "/skydrome.png",
  },
  [SWAP_TYPE.IZUMI]: {
    name: 'Izumi',
    icon: 'https://izumi.finance/assets/home/iziLogo/logo.svg',
  },
  [SWAP_TYPE.SYNCSWAP]: {
    name: 'Syncswap',
    icon: 'https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F3580858907-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fa1srPi3SG0RLa68aU4tX%252Ficon%252Fr9gnUAaUG96bxSLZ02SC%252Flogo-192.png%3Falt%3Dmedia%26token%3Db68cb07a-5d86-40c7-88e0-1a9fcc52ede6',
  },
  [SWAP_TYPE.PUNKSWAP]: {
    name: 'PunkSwap',
    icon: 'https://storage.googleapis.com/ks-setting-1d682dca/bcc2ed81-3d91-4b71-a615-ed4102cf8fb41697557738542.png',
  },
  [SWAP_TYPE.KYBERSWAP]: {
    name: 'KyberSwap',
    icon: 'https://storage.googleapis.com/ks-setting-1d682dca/70129bd5-c3eb-44e8-b9fc-e6d76bf80b921697557071098.png',
  },
  [SWAP_TYPE.COFFEESWAP]: {
    name: 'CoffeeSwap',
    icon: 'https://www.coffeefi.xyz/logo/logo.png',
  },
  [SWAP_TYPE.PAPYRUSSWAP]: {
    name: 'PapyrusSwap',
    icon: 'https://papyrusswap.com/static/media/papyrus-logo.a7f47ae8.png',
  },
  [SWAP_TYPE.SUSHISWAP]: {
    name: 'Sushiswap',
    icon: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png?v=026',
  },
  [SWAP_TYPE.INVALID]: {
    name: 'Sushiswap',
    icon: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png?v=026',
  },
};


export interface Network {
  name: string;
  chainId: number;
  blockConfirmation: number;
  colorClass: string;
  image: string;
  logIndex?: number;
  symbol?: string;
  wrappedNativeAddress: string;
  isTestnet?: boolean;
  decimals?: number;
}

export interface SwapParams {
  poolAddress: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOutMin: string;
  fee: string;
  path: string;
  deadline: number;
  isStable: boolean;
  convertToNative: boolean;
  swapType: number;
}

export interface Route {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  childIndex: number;
  amountOut: BigInt;
  minAmountOut: BigInt;
  tokenOutLiquidity: BigInt;
  routePercentage: number;
  fee: number;
}