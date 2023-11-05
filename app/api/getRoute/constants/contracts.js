const { 
    aggreAggregatorAbi,
    aggreChildAbi,
    iziSwapQuoterAbi,
    iziSwapLiquidityManagerAbi,
    kyberSwapQuoterAbi,
    kyberSwapClassicPoolFactoryAbi,
    punkSwapRouterAbi,
    punkSwapClassicPoolFactoryAbi,
    skyDromeRouterAbi,
    skyDromePairFactoryAbi,
    spaceFiRouterAbi,
    spaceFiClassicPoolFactoryAbi,
    syncSwapRouterAbi,
    syncSwapClassicPoolFactoryAbi,
    coffeeSwapRouterAbi,
    coffeeSwapClassicPoolFactoryAbi,
    papyrusSwapRouterAbi,
    papyrusSwapClassicPoolFactoryAbi,
    sushiSwapRouterAbi,
    sushiSwapClassicPoolFactoryAbi,
    zebraSwapRouterAbi,
    zebraSwapPoolFactoryAbi,
} = require("./abis");

const contracts = {
    aggreAggregator: {
        address: "0xa6b6021c7cB90873D34180B8e7bfC1bB63b66D10",
        abi: aggreAggregatorAbi
    },
    children: {
        aggreChildIziSwap: {
            child: {
                address: "0x61Aa78C3194f327b34a321FdE0358c1DE3c43C52",
                abi: aggreChildAbi
            },
            router: {
                address: "0x2db0AFD0045F3518c77eC6591a542e326Befd3D7",
                abi: ""
            },
            quoter: {
                address: "0x3EF68D3f7664b2805D4E88381b64868a56f88bC4",
                abi: iziSwapQuoterAbi
            },
            liquidityManager: {
                address: "0x1502d025BfA624469892289D45C0352997251728",
                abi: iziSwapLiquidityManagerAbi
            }
        },
        aggreChildKyberSwap: {
            child: {
                address: "0x049B33db89E6a0D89E5B8E4210dBEcCD892cD491",
                abi: aggreChildAbi
            },
            router: {
                address: "0xF9c2b5746c946EF883ab2660BbbB1f10A5bdeAb4",
                abi: ""
            },
            quoter: {
                address: "0x4d47fd5a29904Dae0Ef51b1c450C9750F15D7856",
                abi: kyberSwapQuoterAbi
            },
            classicPoolFactory: {
                address: "0xC7a590291e07B9fe9E64b86c58fD8fC764308C4A",
                abi: kyberSwapClassicPoolFactoryAbi
            }
        },
        aggreChildPunkSwap: {
            child: {
                address: "0x207bCC253ba86ae10158c7642cE515e09Ff02F6A",
                abi: aggreChildAbi
            },
            router: {
                address: "0x26cB8660EeFCB2F7652e7796ed713c9fB8373f8e",
                abi: punkSwapRouterAbi
            },
            classicPoolFactory: {
                address: "0x5640113ea7f369e6dafbe54cbb1406e5bf153e90",
                abi: punkSwapClassicPoolFactoryAbi
            }
        },
        aggreChildSkyDrome: {
            child: {
                address: "0xC3684ce3a900585a319d3E2fA6386b7B38307290",
                abi: aggreChildAbi
            },
            router: {
                address: "0xAA111C62cDEEf205f70E6722D1E22274274ec12F",
                abi: skyDromeRouterAbi
            },
            pairFactory: {
                address: "0x2516212168034b18a0155FfbE59f2f0063fFfBD9",
                abi: skyDromePairFactoryAbi
            }
        },
        aggreChildSpaceFi: {
            child: {
                address: "0x3C547C4b1a43ed699aaDf5Acb949D50BD33E84D1",
                abi: aggreChildAbi
            },
            router: {
                address: "0x18b71386418A9FCa5Ae7165E31c385a5130011b6",
                abi: spaceFiRouterAbi
            },
            classicPoolFactory: {
                address: "0x6cc370ed99f1c11e7ac439f845d0ba6aed55cf50",
                abi: spaceFiClassicPoolFactoryAbi
            }
        },
        aggreChildSyncSwap: {
            child: {
                address: "0x8865f9022f3a8A0d9bCa407C1DC2151A19671f57",
                abi: aggreChildAbi
            },
            router: {
                address: "0x80e38291e06339d10AAB483C65695D004dBD5C69",
                abi: syncSwapRouterAbi
            },
            classicPoolFactory: {
                address: "0x37BAc764494c8db4e54BDE72f6965beA9fa0AC2d",
                abi: syncSwapClassicPoolFactoryAbi
            }
        },
        aggreChildCoffeeSwap: {
            child: {
                address: "0x3F30F823c16BEb60C0b55c9CE7EaFC6Bd80694a9",
                abi: aggreChildAbi
            },
            router: {
                address: "0xdAF8b79B3C46db8bE754Fc5E98b620ee243eb279",
                abi: coffeeSwapRouterAbi
            },
            classicPoolFactory: {
                address: "0x23537BCe0533e53609A49dffdd400e54A825cb81",
                abi: coffeeSwapClassicPoolFactoryAbi
            }
        },
        aggreChildPapyrusSwap: {
            child: {
                address: "0xcF124FBC20d5C1841352B0460BD81cc6eAD53055",
                abi: aggreChildAbi
            },
            router: {
                address: "0x29ACA061b49753765A3DBC130DBF16D4477bFd3F",
                abi: papyrusSwapRouterAbi
            },
            classicPoolFactory: {
                address: "0xD5f3D3fb72210bfe71a59c05e0b8D72973baa2a6",
                abi: papyrusSwapClassicPoolFactoryAbi
            }
        },
        aggreChildSushiSwap: {
            child: {
                address: "0x8B876D9DA60D54210EfbD17a94dD3981ddD78055",
                abi: aggreChildAbi
            },
            router: {
                address: "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE",
                abi: sushiSwapRouterAbi
            },
            classicPoolFactory: {
                address: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
                abi: sushiSwapClassicPoolFactoryAbi
            }
        },
        aggreChildZebraSwap: {
            child: {
                address: "0x64ccEB94453710a301580Ef0dabf3CF461D37cf5",
                abi: aggreChildAbi
            },
            router: {
                address: "0x0122960d6e391478bfE8fB2408Ba412D5600f621",
                abi: zebraSwapRouterAbi
            },
            poolFactory: {
                address: "0xa63eb44c67813cad20A9aE654641ddc918412941",
                abi: zebraSwapPoolFactoryAbi
            }
        }
    }
}

module.exports = contracts;