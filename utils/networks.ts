import { goerli, bscTestnet } from "wagmi/chains";

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
];
