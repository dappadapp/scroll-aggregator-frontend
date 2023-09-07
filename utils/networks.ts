import { goerli, bscTestnet, scrollTestnet, zkSyncTestnet } from "wagmi/chains";

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

export const networks: Network[] = [
  {
    name: goerli.name,
    chainId: goerli.id,
    blockConfirmation: 3,
    wrappedNativeAddress: "test",

    colorClass: "bg-[#373737]",
    image: "ethereum.svg",
    symbol: "ETH",
    isTestnet: true,
  },
  {
    name: bscTestnet.name,
    chainId: bscTestnet.id,
    wrappedNativeAddress: "test",
    blockConfirmation: 3,
    colorClass: "bg-[#EFB90A]",
    image: "bsc.svg",
    symbol: "BNB",
    isTestnet: true,
  },
  {
    name: scrollTestnet.name,
    chainId: scrollTestnet.id,
    wrappedNativeAddress: "test",
    blockConfirmation: 3,
    colorClass: "bg-[#EFB90A]",
    image: "scroll.svg",
    symbol: scrollTestnet.nativeCurrency.symbol,
    isTestnet: true,
  },
  {
    name: zkSyncTestnet.name,
    chainId: zkSyncTestnet.id,
    wrappedNativeAddress: "test",
    blockConfirmation: 3,
    colorClass: "bg-[#EFB90A]",
    image: "zksync-era.svg",
    symbol: zkSyncTestnet.nativeCurrency.symbol,
    isTestnet: true,
  },
];
