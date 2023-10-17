import { ChainId, SWAP_TYPE } from "@/types";

export const UNISWAP_DEFAULT_FEE = 0;

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
  [chain: string]: {
    contract: `0x${string}`,
    spacefi?: {
      router: `0x${string}`,
      poolFactory: `0x${string}`,
    },
    uniswap?: {
      router: `0x${string}`,
      poolFactory: `0x${string}`,
    },
    iziswap?: {
      router: `0x${string}`,
      liquidityManager: `0x${string}`,
    },
    skydrome?: {
      router: `0x${string}`,
      poolFactory: `0x${string}`,
    }
  }    
} = {

  [ChainId.SCROLL_SEPOLIA]: {
    contract: "0xCA3c42f9D37e7b1481fb61e83798d0778Af77c84",
    spacefi: {
      router: "0xF4EE7c4bDd43F6b5E509204B375E9512e4110C15",
      poolFactory: "0x2E7444aB4b3C469f5eba37574739133783e0a4CD"
    },
    uniswap: {
      router: "0x17AFD0263D6909Ba1F9a8EAC697f76532365Fb95", //quoter contract
      poolFactory: "0xB856587fe1cbA8600F75F1b1176E44250B11C788"
    },
    iziswap: {
      router: "0xa9754f0D9055d14EB0D2d196E4C51d8B2Ee6f4d3", //quoter
      // router: "0x77132b63429718Db2B6ad8D942eE13A198f6Ab49", //swap router
      liquidityManager: "0xF4EE7c4bDd43F6b5E509204B375E9512e4110C15"
    },
    skydrome: {
      router: "0x00000000",
      poolFactory: "0x00000000"
    },
  }, 
  [ChainId.SCROLL_MAINNET]: {
    contract: "0x7F93aBc94a8a9F88Ec9Eb35B5750b7a97931000C",
    spacefi: {
      router: "0x18b71386418A9FCa5Ae7165E31c385a5130011b6",
      poolFactory: "0x6cc370ed99f1c11e7ac439f845d0ba6aed55cf50"
    },
    skydrome: {
      router: "0xAA111C62cDEEf205f70E6722D1E22274274ec12F",
      poolFactory: "0x2516212168034b18a0155FfbE59f2f0063fFfBD9"
    },
    iziswap: {
      router: "0x2db0AFD0045F3518c77eC6591a542e326Befd3D7",
      liquidityManager: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08"
    }
  }
}

