import { ethers } from "ethers";
const { syncSwapClassicPoolAbi } = require("../../../constants/abis");

const findRouteInAggreChildSyncSwap = async (contractsUpdated, provider, tokenIn, tokenOut) => {
    const classicPoolFactoryContract = new ethers.Contract( contractsUpdated.children.aggreChildSyncSwap.classicPoolFactory.address, contractsUpdated.children.aggreChildSyncSwap.classicPoolFactory.abi,provider);

    let poolAddress = "0x0000000000000000000000000000000000000000";
    let poolContract = null;
    let tokenOutLiquidity = 0;
    
    try {
        poolAddress = await classicPoolFactoryContract.getPool(tokenOut.address, tokenIn.address);
        poolContract = new ethers.Contract(poolAddress, syncSwapClassicPoolAbi, provider);

        const reserves = await poolContract.getReserves();
        const tokenOneAddress = await poolContract.token0();

        if (tokenOneAddress === tokenIn.address) {
            tokenOutLiquidity = reserves[1];
        } else {
            tokenOutLiquidity = reserves[0];
        }
    
        // console.log("    ~ Liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool is " + ethers.utils.formatUnits(tokenOutLiquidity, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 6"); 
    } catch (error) {
        // console.log("    ~ Could not find liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool on Aggre Child 6");
    }

    return tokenOutLiquidity
};

const getRouteAmountOutInAggreChildSyncSwap = async (contractsUpdated, provider, tokenIn, tokenOut, amountIn) => {
    const aggreAggregatorContract = new ethers.Contract(contractsUpdated.aggreAggregator.address, contractsUpdated.aggreAggregator.abi, provider);
    const classicPoolFactoryContract = new ethers.Contract( contractsUpdated.children.aggreChildSyncSwap.classicPoolFactory.address, contractsUpdated.children.aggreChildSyncSwap.classicPoolFactory.abi,provider);
    const poolAddress = await classicPoolFactoryContract.getPool(tokenOut.address, tokenIn.address);
    const poolContract = new ethers.Contract(poolAddress, syncSwapClassicPoolAbi, provider);

    const feeAddress = await aggreAggregatorContract.feeAddress();

    let amountOut;

    try {
        const result = await poolContract.getAmountOut(tokenIn.address, amountIn, feeAddress);
        amountOut = result;

        // console.log("    ~ Amount out is " + ethers.utils.formatUnits(amountOut, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 6");
    } catch (error) {
        amountOut = 0;
    }

    return amountOut
}

module.exports = { findRouteInAggreChildSyncSwap, getRouteAmountOutInAggreChildSyncSwap };