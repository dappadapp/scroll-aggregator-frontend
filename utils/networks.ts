import { goerli, bscTestnet } from "wagmi/chains";

export interface Network {
  name: string;
  chainId: number;
  nftContractAddress: string;
  blockConfirmation: number;
  colorClass: string;
  image: string;
  logIndex?: number;
  symbol?: string;
  isTestnet?: boolean;
}

export const networks: Network[] = [
  {
    name: goerli.name,
    chainId: goerli.id,
    nftContractAddress: "0xA245D6427742c9e342817329f8Ac620dAdB0ed45",
    blockConfirmation: 3,
    colorClass: "bg-[#373737]",
    image: "ethereum.svg",
    symbol: "ETH",
    isTestnet: true,
  },
  {
    name: bscTestnet.name,
    chainId: bscTestnet.id,
    nftContractAddress: "0x07231C3464eA825bf9490f4C673723E63ebD95F7",
    blockConfirmation: 3,
    colorClass: "bg-[#EFB90A]",
    image: "bsc.svg",
    symbol: "BNB",
    isTestnet: true,
  },
];
