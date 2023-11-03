const tokens = require("./tokens");

const settings = {
    global: {
        rpcUrl: "https://rpc.scroll.io", // @dev http://localhost:8545
    },
    search: {
        maxBestRouteCount: 2, // @dev Same token pair and multiple dexes
        liquidityThreshold: 5, // @dev Liquidity threshold for maximum pool size
        liquidityMin: 1*10**5, // @dev Minimum amount of liquidity for pools to be considered
        childIndexRouteBlacklist: [
            { childIndex: 4, tokenIn: tokens[2], tokenOut: tokens[1] },
            { childIndex: 4, tokenIn: tokens[1], tokenOut: tokens[2] }
        ],
    }
}

module.exports = settings;