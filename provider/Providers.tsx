"use client";

import React from "react";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig, Chain } from "wagmi";
import {
  mainnet,
  goerli,
  zkSync,
  polygonZkEvm,
  zkSyncTestnet,
  optimismGoerli,
  optimism,
  polygonZkEvmTestnet,
  polygon,
  polygonMumbai,
  bsc,
  bscTestnet,
  avalanche,
  arbitrum,
  arbitrumGoerli,
  fantom,
  fantomTestnet,
  dfk,
  harmonyOne,
  celo,
  moonbeam,
  gnosis,
  klaytn,
  metis,
  metisGoerli,
  canto,
  moonriver,
  base,
  sepolia,
  scrollTestnet,
  mantle,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "react-query";

const dexalot = {
  id: 432204,
  name: "Dexalot Subnet",
  network: "dexalot",
  nativeCurrency: {
    decimals: 18,
    name: "Alot",
    symbol: "ALOT",
  },
  rpcUrls: {
    default: {
      http: ["https://subnets.avax.network/dexalot/mainnet/rpc"],
    },
    public: {
      http: ["https://subnets.avax.network/dexalot/mainnet/rpc"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Dexalot Explorer",
      url: "https://subnets.avax.network/dexalot",
    },
    default: {
      name: "Dexalot Explorer",
      url: "https://subnets.avax.network/dexalot",
    },
  },
} as const satisfies Chain;

const fuse = {
  id: 122,
  name: "Fuse Mainnet",
  network: "fuse",
  nativeCurrency: {
    decimals: 18,
    name: "Fuse",
    symbol: "FUSE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.fuse.io"],
    },
    public: {
      http: ["https://rpc.fuse.io"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Fuse Explorer",
      url: "https://explorer.fuse.io/",
    },
    default: {
      name: "Fuse Explorer",
      url: "https://explorer.fuse.io/",
    },
  },
} as const satisfies Chain;

const klaytn_ = {
  ...klaytn,
  rpcUrls: {
    default: {
      http: ["https://public-node-api.klaytnapi.com/v1/cypress"],
    },
    public: {
      http: ["https://public-node-api.klaytnapi.com/v1/cypress"],
    },
  },
} as const satisfies Chain;

const core = {
  id: 1116,
  name: "Core Blockchain Mainnet",
  network: "core",
  nativeCurrency: {
    decimals: 18,
    name: "Core",
    symbol: "CORE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.coredao.org"],
    },
    public: {
      http: ["https://rpc.coredao.org"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Core Explorer",
      url: "https://scan.coredao.org/",
    },
    default: {
      name: "Core Explorer",
      url: "https://scan.coredao.org/",
    },
  },
} as const satisfies Chain;

const okx = {
  id: 66,
  name: "OKXChain Mainnet",
  network: "okx",
  nativeCurrency: {
    decimals: 18,
    name: "Okt",
    symbol: "OKT",
  },
  rpcUrls: {
    default: {
      http: ["https://exchainrpc.okex.org"],
    },
    public: {
      http: ["https://exchainrpc.okex.org"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "OKX Explorer",
      url: "https://www.okx.com/tr/explorer/oktc",
    },
    default: {
      name: "OKX Explorer",
      url: "https://www.okx.com/tr/explorer/oktc",
    },
  },
} as const satisfies Chain;

const tenet = {
  id: 1559,
  name: "Tenet",
  network: "tenet",
  nativeCurrency: {
    decimals: 18,
    name: "Tenet",
    symbol: "TENET",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.tenet.org"],
    },
    public: {
      http: ["https://rpc.tenet.org"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Tenet Explorer",
      url: "https://tenetscan.io/",
    },
    default: {
      name: "Tenet Explorer",
      url: "https://tenetscan.io/",
    },
  },
} as const satisfies Chain;

const arbNova = {
  id: 42170,
  name: "Arbitrum Nova",
  network: "nova",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://nova.arbitrum.io/rpc"],
    },
    public: {
      http: ["https://nova.arbitrum.io/rpc"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Arbitrum Nova Explorer",
      url: "https://nova.arbiscan.io/",
    },
    default: {
      name: "Arbitrum Nova Explorer",
      url: "https://nova.arbiscan.io/",
    },
  },
} as const satisfies Chain;

const meter = {
  id: 82,
  name: "Meter Mainnet",
  network: "meter",
  nativeCurrency: {
    decimals: 18,
    name: "Meter",
    symbol: "MTR",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.meter.io"],
    },
    public: {
      http: ["https://rpc.meter.io"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Meter Explorer",
      url: "https://scan.meter.io/",
    },
    default: {
      name: "Meter Explorer",
      url: "https://scan.meter.io/",
    },
  },
} as const satisfies Chain;

const kava = {
  id: 2222,
  name: "Kava EVM",
  network: "kava",
  nativeCurrency: {
    decimals: 18,
    name: "Kava",
    symbol: "KAVA",
  },
  rpcUrls: {
    default: {
      http: ["https://evm2.kava.io"],
    },
    public: {
      http: ["https://evm2.kava.io"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Meter Explorer",
      url: "https://explorer.kava.io/",
    },
    default: {
      name: "Meter Explorer",
      url: "https://explorer.kava.io/",
    },
  },
} as const satisfies Chain;

const linea = {
  id: 59144,
  name: "Linea",
  network: "linea",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.linea.build/"],
    },
    public: {
      http: ["https://rpc.linea.build/"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Meter Explorer",
      url: "https://lineascan.build/",
    },
    default: {
      name: "Meter Explorer",
      url: "https://lineascan.build/",
    },
  },
} as const satisfies Chain;

const chains = [
  mainnet,
  goerli,
  zkSync,
  zkSyncTestnet,
  polygonZkEvm,
  polygonZkEvmTestnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  bsc,
  bscTestnet,
  avalanche,
  arbitrum,
  arbitrumGoerli,
  fantom,
  fantomTestnet,
  dfk,
  harmonyOne,
  celo,
  moonbeam,
  gnosis,
  klaytn_,
  metis,
  metisGoerli,
  canto,
  moonriver,
  sepolia,
  dexalot,
  fuse,
  core,
  okx,
  tenet,
  arbNova,
  meter,
  kava,
  base,
  linea,
  mantle,
  scrollTestnet,
];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      </QueryClientProvider>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
