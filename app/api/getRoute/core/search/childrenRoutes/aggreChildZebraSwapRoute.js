const { ethers } = require("ethers");
const { contracts, abis } = require("../../../constants");

const findRouteInAggreChildZebraSwap = async (provider, tokenIn, tokenOut) => {
    let poolAddress = await getPoolAddressInAggreChildZebraSwap(provider, tokenIn, tokenOut);
    let tokenOutLiquidity = 0;

    try {
        const poolContract = new ethers.Contract(poolAddress, abis.zebraSwapPoolAbi, provider);

        const reserves = await poolContract.getReserves();
        const tokenOneAddress = await poolContract.token0();

        if (tokenOneAddress === tokenIn.address) {
            tokenOutLiquidity = reserves[1];
        } else {
            tokenOutLiquidity = reserves[0];
        }
    
        // console.log("    ~ Liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool is " + ethers.formatUnits(tokenOutLiquidity, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 7"); 
    } catch (error) {
        // console.log("    ~ Could not find liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool on Aggre Child 7");
    }

    return tokenOutLiquidity
};

const getPoolAddressInAggreChildZebraSwap = async (provider, tokenIn, tokenOut) => {
    const poolFactoryContract = new ethers.Contract(contracts.children.aggreChildZebraSwap.poolFactory.address, contracts.children.aggreChildZebraSwap.poolFactory.abi, provider);
    
    let poolAddress = "0x0000000000000000000000000000000000000000";

    try {
        poolAddress = await poolFactoryContract.getPair(tokenIn.address, tokenOut.address);
    } catch (error) {}

    return poolAddress;
}

const getRouteAmountOutInAggreChildZebraSwap = async (provider, tokenIn, tokenOut, amountIn) => {
    const coffeeSwapRouterContract = new ethers.Contract(contracts.children.aggreChildZebraSwap.router.address, contracts.children.aggreChildZebraSwap.router.abi, provider);

    let amountOut;
    
    try {
        const result = await coffeeSwapRouterContract.getAmountsOut(amountIn, [tokenIn.address, tokenOut.address]);
        amountOut = result[1];

        // console.log("    ~ Amount out is " + ethers.formatUnits(amountOut, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 7");
    } catch (error) {
        amountOut = 0;
    }

    return amountOut
}

module.exports = { findRouteInAggreChildZebraSwap, getPoolAddressInAggreChildZebraSwap, getRouteAmountOutInAggreChildZebraSwap };