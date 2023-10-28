import { ChainId, SWAP_TYPE } from "@/types";

export const UNISWAP_DEFAULT_FEE = 300;

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
    },
    syncswap?: {
      router: `0x${string}`,
      poolFactory: `0x${string}`,
    },
    punkswap?: {
      router: `0x${string}`,
      poolFactory: `0x${string}`,
    },
    kyberswap?: {
      router: `0x${string}`,
      poolFactory: `0x${string}`,
    },
    coffeswap?: {
      router: `0x${string}`,
      poolFactory: `0x${string}`,
    },
    papyrusswap?: {
      router: `0x${string}`,
      poolFactory: `0x${string}`,
    },
    sushiswap?: {
      router: `0x${string}`,
      poolFactory: `0x${string}`,
    },

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
    contract: "0xcf8bcaCb401C31774EA39296b367B9DaB4F72267",
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
    },
    syncswap: {
      router: "0x80e38291e06339d10AAB483C65695D004dBD5C69",
      poolFactory: "0x37BAc764494c8db4e54BDE72f6965beA9fa0AC2d"
    },
    punkswap: {
      router: "0x26cb8660eefcb2f7652e7796ed713c9fb8373f8e",
      poolFactory: "0x5640113ea7f369e6dafbe54cbb1406e5bf153e90"
    },
    kyberswap: {
      router: "0xF9c2b5746c946EF883ab2660BbbB1f10A5bdeAb4",
      poolFactory: "0xC7a590291e07B9fe9E64b86c58fD8fC764308C4A"
    },
    coffeswap: {
      router: "0xdAF8b79B3C46db8bE754Fc5E98b620ee243eb279",
      poolFactory: "0x23537BCe0533e53609A49dffdd400e54A825cb81"
    },
    papyrusswap: {
      router: "0x29ACA061b49753765A3DBC130DBF16D4477bFd3F",
      poolFactory: "0xD5f3D3fb72210bfe71a59c05e0b8D72973baa2a6"
    },
    sushiswap: {
      router: "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE",
      poolFactory: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763"
    },
    
  }
}

