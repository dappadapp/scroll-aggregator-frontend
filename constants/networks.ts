import { Network } from "@/types";
import { goerli, bscTestnet, scrollTestnet, scrollSepolia, zkSyncTestnet, scroll } from "wagmi/chains";

export const networks: Network[] = [
  // {
  //   name: goerli.name,
  //   chainId: goerli.id,
  //   blockConfirmation: 3,
  //   wrappedNativeAddress: "test",

  //   colorClass: "bg-[#373737]",
  //   image: "ethereum.svg",
  //   symbol: "ETH",
  //   isTestnet: true,
  // },
  // {
  //   name: bscTestnet.name,
  //   chainId: bscTestnet.id,
  //   wrappedNativeAddress: "test",
  //   blockConfirmation: 3,
  //   colorClass: "bg-[#EFB90A]",
  //   image: "bsc.svg",
  //   symbol: "BNB",
  //   isTestnet: true,
  // },

  {
    name: scroll.name,
    chainId: scroll.id,
    wrappedNativeAddress: "test",
    blockConfirmation: 3,
    colorClass: "bg-[#EFB90A]",
    image: "scroll.svg",
    symbol: scroll.nativeCurrency.symbol,
    isTestnet: false,
  },
/*
   {
    name: scrollSepolia.name,
    chainId: scrollSepolia.id,
    wrappedNativeAddress: "test",
    blockConfirmation: 3,
    colorClass: "bg-[#EFB90A]",
    image: "scroll.svg",
    symbol: scrollSepolia.nativeCurrency.symbol,
    isTestnet: true,
  },
 */
  // {
  //   name: scrollTestnet.name,
  //   chainId: scrollTestnet.id,
  //   wrappedNativeAddress: "test",
  //   blockConfirmation: 3,
  //   colorClass: "bg-[#EFB90A]",
  //   image: "scroll.svg",
  //   symbol: scrollTestnet.nativeCurrency.symbol,
  //   isTestnet: true,
  // },
  // {
  //   name: zkSyncTestnet.name,
  //   chainId: zkSyncTestnet.id,
  //   wrappedNativeAddress: "test",
  //   blockConfirmation: 3,
  //   colorClass: "bg-[#EFB90A]",
  //   image: "zksync-era.svg",
  //   symbol: zkSyncTestnet.nativeCurrency.symbol,
  //   isTestnet: true,
  // },
];
