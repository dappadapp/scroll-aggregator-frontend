import { ethers } from "ethers";
const { contracts, abis } = require("../../../constants");

const findRouteInAggreChildPapyrusSwap = async (provider, tokenIn, tokenOut) => {
    let poolAddress = await getPoolAddressInAggreChildPapyrusSwap(provider, tokenIn, tokenOut);
    let tokenOutLiquidity = 0;
    
    try {
        const poolContract = new ethers.Contract(poolAddress, abis.papyrusSwapPoolAbi, provider);

        const reserves = await poolContract.getReserves();
        const tokenOneAddress = await poolContract.token0();

        if (tokenOneAddress === tokenIn.address) {
            tokenOutLiquidity = reserves[1];
        } else {
            tokenOutLiquidity = reserves[0];
        }
    
        // console.log("    ~ Liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool is " + ethers.formatUnits(tokenOutLiquidity, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 8"); 
    } catch (error) {
        // console.log("    ~ Could not find liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool on Aggre Child 8");
    }

    return tokenOutLiquidity
};

const getPoolAddressInAggreChildPapyrusSwap = async (provider, tokenIn, tokenOut) => {
    const poolFactoryContract = new ethers.Contract(contracts.children.aggreChildPapyrusSwap.poolFactory.address, contracts.children.aggreChildPapyrusSwap.poolFactory.abi, provider);
    
    let poolAddress = "0x0000000000000000000000000000000000000000";

    try {
        poolAddress = await poolFactoryContract.getPair(tokenIn.address, tokenOut.address);
    } catch (error) {}

    return poolAddress;
}

const getRouteAmountOutInAggreChildPapyrusSwap = async (provider, tokenIn, tokenOut, amountIn) => {
    const papyrusSwapRouterContract = new ethers.Contract(contracts.children.aggreChildPapyrusSwap.router.address, contracts.children.aggreChildPapyrusSwap.router.abi, provider);

    let amountOut;
    
    try {
        const result = await papyrusSwapRouterContract.getAmountsOut(amountIn, [tokenIn.address, tokenOut.address]);
        amountOut = result[1];

        // console.log("    ~ Amount out is " + ethers.formatUnits(amountOut, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 8");
    } catch (error) {
        amountOut = 0;
    }

    return amountOut
}

module.exports = { findRouteInAggreChildPapyrusSwap, getPoolAddressInAggreChildPapyrusSwap, getRouteAmountOutInAggreChildPapyrusSwap };