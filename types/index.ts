import { mainnet, goerli, bsc, bscTestnet, scrollSepolia, scrollTestnet, zkSync, zkSyncTestnet } from "wagmi/chains";

export * from './token'

export enum ChainId {
  ETHEREUM = mainnet.id,
  GOERLI = goerli.id,
  BSC = bsc.id,
  BSC_TESTNET = bscTestnet.id,
  ZKSYNC = zkSync.id,
  ZKSYNC_TESTNET = zkSyncTestnet.id,
  SCROLL = scrollSepolia.id,
  SCROLL_TESTNET = scrollTestnet.id,
}

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
}
