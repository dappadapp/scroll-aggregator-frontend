import { ChainId, ERC20Token } from "@/types";

export const WETH9 = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    18,
    "WETH",
    "Wrapped Ether",
    "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
    "https://weth.io"
  ),
  [ChainId.GOERLI]: new ERC20Token(
    ChainId.GOERLI,
    "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    18,
    "WETH",
    "Wrapped Ether",
    "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
    "https://weth.io"
  ),
  [ChainId.BSC]: new ERC20Token(
    ChainId.BSC,
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    18,
    "ETH",
    "Binance-Peg Ethereum Token",
    "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
    "https://ethereum.org"
  ),
  [ChainId.BSC_TESTNET]: new ERC20Token(
    ChainId.BSC,
    "0xE7bCB9e341D546b66a46298f4893f5650a56e99E",
    18,
    "ETH",
    "ETH",
    "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
    "https://ethereum.org"
  ),
  [ChainId.ZKSYNC]: new ERC20Token(
    ChainId.ZKSYNC,
    "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
    18,
    "WETH",
    "Wrapped Ether",
    "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
    "https://weth.io"
  ),
  [ChainId.ZKSYNC_TESTNET]: new ERC20Token(
    ChainId.ZKSYNC_TESTNET,
    "0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0",
    18,
    "WETH",
    "Wrapped Ether",
    "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
    "https://weth.io"
  ),
  [ChainId.SCROLL_TESTNET]: new ERC20Token(
    ChainId.SCROLL_TESTNET,
    "0x7160570bb153edd0ea1775ec2b2ac9b65f1ab61b",
    18,
    "WETH",
    "Wrapped Ether",
    "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
    "https://weth.io"
  ),
  [ChainId.SCROLL_SEPOLIA]: new ERC20Token(
    ChainId.SCROLL_SEPOLIA,
    "0x5300000000000000000000000000000000000004",
    18,
    "WETH",
    "Wrapped Ether",
    "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
    "https://weth.io"
  ),
  [ChainId.SCROLL_MAINNET]: new ERC20Token(
    ChainId.SCROLL_MAINNET,
    "0x5300000000000000000000000000000000000004",
    18,
    "WETH",
    "Wrapped Ether",
    "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
    "https://weth.io"
  ),
};

export const WBNB = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    "0x418D75f65a02b3D53B2418FB8E1fe493759c7605",
    18,
    "WBNB",
    "Wrapped BNB",
    "https://www.binance.org"
  ),
  [ChainId.BSC]: new ERC20Token(
    ChainId.BSC,
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    18,
    "WBNB",
    "Wrapped BNB",
    "https://www.binance.org"
  ),
  [ChainId.BSC_TESTNET]: new ERC20Token(
    ChainId.BSC_TESTNET,
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    18,
    "WBNB",
    "Wrapped BNB",
    "https://www.binance.org"
  ),
};

export const WNATIVE = {
  // [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
  // [ChainId.GOERLI]: WETH9[ChainId.GOERLI],
  // [ChainId.BSC]: WBNB[ChainId.BSC],
  // [ChainId.BSC_TESTNET]: WBNB[ChainId.BSC_TESTNET],
  // [ChainId.ZKSYNC]: WETH9[ChainId.ZKSYNC],
  // [ChainId.ZKSYNC_TESTNET]: WETH9[ChainId.ZKSYNC_TESTNET],
  // [ChainId.SCROLL]: WETH9[ChainId.SCROLL],
  // [ChainId.SCROLL_TESTNET]: WETH9[ChainId.SCROLL_TESTNET],
  //[ChainId.SCROLL_SEPOLIA]: WETH9[ChainId.SCROLL_SEPOLIA],
  [ChainId.SCROLL_MAINNET]: WETH9[ChainId.SCROLL_MAINNET],
} satisfies Record<ChainId, ERC20Token>;

const ETHER = { name: "Ether", symbol: "ETH", decimals: 18, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026' } as const;

export const NATIVE = {
  [ChainId.ETHEREUM]: ETHER,
  [ChainId.GOERLI]: { name: "Goerli Ether", symbol: "GOR", decimals: 18, logo: '' },
  [ChainId.BSC]: {
    name: "Binance Chain Native Token",
    symbol: "BNB",
    decimals: 18,
    logo: ''
  },
  [ChainId.BSC_TESTNET]: {
    name: "Binance Chain Native Token",
    symbol: "tBNB",
    decimals: 18,
    logo: ''
  },
  [ChainId.ZKSYNC]: ETHER,
  [ChainId.ZKSYNC_TESTNET]: ETHER,
  [ChainId.SCROLL_SEPOLIA]: ETHER,
  [ChainId.SCROLL_TESTNET]: ETHER,
  [ChainId.SCROLL_MAINNET]: ETHER,
} satisfies Record<
  ChainId,
  {
    name: string;
    symbol: string;
    decimals: number;
    logo?: string;
  }
>;

export const USDC_BSC = new ERC20Token(
  ChainId.BSC,
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  18,
  "USDC",
  "Binance-Peg USD Coin",
  "https://www.centre.io/usdc"
);

export const USDC_TESTNET = new ERC20Token(
  ChainId.BSC_TESTNET,
  "0x64544969ed7EBf5f083679233325356EbE738930",
  18,
  "USDC",
  "Binance-Peg USD Coin",
  "https://www.centre.io/usdc"
);

export const USDC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  6,
  "USDC",
  "USD Coin"
);

export const USDC_GOERLI = new ERC20Token(
  ChainId.GOERLI,
  "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
  6,
  "tUSDC",
  "test USD Coin"
);

export const USDT_BSC = new ERC20Token(
  ChainId.BSC,
  "0x55d398326f99059fF775485246999027B3197955",
  18,
  "USDT",
  "Tether USD",
  "https://tether.to/"
);

export const USDT_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  6,
  "USDT",
  "Tether USD",
  "https://tether.to/"
);

export const USDT_SCROLL_SEPOLIA = new ERC20Token(
  ChainId.SCROLL_SEPOLIA,
  "0x85BB8651cb707150660c4658B7A11a8cdA5B4Fe3",
  18,
  "USDT",
  "Tether USD",
  "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=026",
  "https://tether.to/"
);

export const USDC_SCROLL_MAINNET = new ERC20Token(
  ChainId.SCROLL_MAINNET,
  "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
  6,
  "USDC",
  "USD COIN",
  "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  "https://coinmarketcap.com/de/currencies/usd-coin/"
);

export const USDT_SCROLL_MAINNET = new ERC20Token(
  ChainId.SCROLL_MAINNET,
  "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
  6,
  "USDT",
  "Tether USD",
  "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=026",
  "https://tether.to/"
);

export const BUSD_BSC = new ERC20Token(
  ChainId.BSC,
  "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  18,
  "BUSD",
  "Binance USD",
  "https://www.paxos.com/busd/"
);

export const BUSD_TESTNET = new ERC20Token(
  ChainId.BSC_TESTNET,
  "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814",
  18,
  "BUSD",
  "Binance USD",
  "https://www.paxos.com/busd/"
);

export const BUSD_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
  18,
  "BUSD",
  "Binance USD",
  "https://www.paxos.com/busd/"
);

export const BUSD_GOERLI = new ERC20Token(
  ChainId.GOERLI,
  "0xb809b9B2dc5e93CB863176Ea2D565425B03c0540",
  18,
  "BUSD",
  "Binance USD",
  "https://www.paxos.com/busd/"
);

export const BUSD = {
  [ChainId.ETHEREUM]: BUSD_ETH,
  [ChainId.GOERLI]: BUSD_GOERLI,
  [ChainId.BSC]: BUSD_BSC,
  [ChainId.BSC_TESTNET]: BUSD_TESTNET,
  [ChainId.ZKSYNC]: new ERC20Token(
    ChainId.ZKSYNC,
    "0x2039bb4116B4EFc145Ec4f0e2eA75012D6C0f181",
    18,
    "BUSD",
    "Binance USD"
  ),
};

export const USDC = {
  [ChainId.BSC]: USDC_BSC,
  [ChainId.BSC_TESTNET]: USDC_TESTNET,
  [ChainId.ETHEREUM]: USDC_ETH,
  [ChainId.GOERLI]: USDC_GOERLI,
  [ChainId.SCROLL_MAINNET]: USDC_SCROLL_MAINNET,
  [ChainId.ZKSYNC]: new ERC20Token(
    ChainId.ZKSYNC,
    "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.ZKSYNC_TESTNET]: new ERC20Token(
    ChainId.ZKSYNC_TESTNET,
    "0x0faF6df7054946141266420b43783387A78d82A9",
    6,
    "USDC",
    "USD Coin"
  ),
};

export const USDT = {
  [ChainId.BSC]: USDT_BSC,
  [ChainId.ETHEREUM]: USDT_ETH,
  [ChainId.SCROLL_SEPOLIA]: USDT_SCROLL_SEPOLIA,
  [ChainId.SCROLL_MAINNET]: USDT_SCROLL_MAINNET

};

export const WBTC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  8,
  "WBTC",
  "Wrapped BTC"
);

export const STABLE_COIN = {
  [ChainId.ETHEREUM]: USDT[ChainId.ETHEREUM],
  [ChainId.GOERLI]: USDC[ChainId.GOERLI],
  [ChainId.BSC]: USDT[ChainId.BSC],
  [ChainId.BSC_TESTNET]: BUSD[ChainId.BSC_TESTNET],
  [ChainId.ZKSYNC]: USDC[ChainId.ZKSYNC],
  [ChainId.ZKSYNC_TESTNET]: USDC[ChainId.ZKSYNC_TESTNET],
} satisfies Record<ChainId, ERC20Token>;
