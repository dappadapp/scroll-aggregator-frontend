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
        address: "0x55E4DE637dAB6a5A98bC643ED3918B35AA20407E",
        abi: aggreAggregatorAbi
    },
    children: {
        aggreChildIziSwap: {
            child: {
                address: "0x84fF8F8B818076584b911E55E8926D6b4E4926cf",
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
                address: "0x3e9d679506F890390Cc390db8bD23b0e8406d2D8",
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
                address: "0xe66003Db59C674F9a6325BB7F91ca78d8f5057C8",
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
                address: "0x9388Fd3A80ee9F217844817bD2828FD8BDCD4821",
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
                address: "0x0d93878c96d9B39122a629047Eb8EEc722663790",
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
                address: "0x5F20904177292a06F00Edafc3b8a9f9DAEcfE250",
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
                address: "0x4c54231925c848B6f85277657EF344699EB98aE7",
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
                address: "0x0000000000000000000000000000000000000000",
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
                address: "0x0000000000000000000000000000000000000000",
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
                address: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
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