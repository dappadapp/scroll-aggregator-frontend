import { ChainId } from "@/types";

export const addresses : {
  [key: string]: `0x${string}`
} = {
  connectorAddress: "0x00005e3125aba53c5652f9f0ce1a4cf91d8b15ea",
  zetaTokenAddress: "0x0000c304d2934c00db1d51995b9f6996affd17c0",
  zetaTokenConsumerUniV2: "0x8eAc517b92eeE82177a83851268F13109878f8c4",
  zetaTokenConsumerUniV3: "0xd886b7Af031F9a505310bA01951948BD1d673aF1",

  crossChainSwap: "0x07231C3464eA825bf9490f4C673723E63ebD95F7",
  systemContract: "0x91d18e54DAf4F677cB28167158d6dd21F6aB3921",

  syncswapClassicPoolFactory: "0x46c8dc568ED604bB18C066Fc8d387859b7977836", // scroll
  syncswapStablePoolFactory: "0x441B24fc497317767a9D293931A33939953F251f"   // scroll
};

export const aggregator : {
  [key: string]: {
    contract: `0x${string}`,
    router: `0x${string}`,
    poolFactory: `0x${string}`,
  }    
} = {
  [ChainId.SCROLL_SEPOLIA]: {
    contract: "0xCA3c42f9D37e7b1481fb61e83798d0778Af77c84",
    router: "0xF4EE7c4bDd43F6b5E509204B375E9512e4110C15",
    poolFactory: "0x2E7444aB4b3C469f5eba37574739133783e0a4CD"
  }
}

