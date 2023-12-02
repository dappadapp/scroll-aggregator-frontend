import { ChainId, SWAP_TYPE } from "@/types";

export const DEFAULT_FEE = 300;

export const addresses : {
  [key: string]: `0x${string}`
} = {};

export const aggregator : {
  [chain: string]: {
    contract: `0x${string}`
  }    
} = {

  [ChainId.SCROLL_SEPOLIA]: {
    contract: "0xCA3c42f9D37e7b1481fb61e83798d0778Af77c84"
  }, 
  [ChainId.SCROLL_MAINNET]: {
    contract: "0x40604478D931d60EEb81410A49e5Cac3bF19c0af"
  }
}

