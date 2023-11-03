import { ethers } from "ethers";
const { contracts, abis } = require("../../../constants");

const findRouteInAggreChildSyncSwap = async (provider, tokenIn, tokenOut) => {
    let poolAddress = await getPoolAddressInAggreChildSyncSwap(provider, tokenIn, tokenOut);
    let tokenOutLiquidity = 0;
    
    try {
        const poolContract = new ethers.Contract(poolAddress, abis.syncSwapPoolAbi, provider);

        const reserves = await poolContract.getReserves();
        const tokenOneAddress = await poolContract.token0();

        if (tokenOneAddress === tokenIn.address) {
            tokenOutLiquidity = reserves[1];
        } else {
            tokenOutLiquidity = reserves[0];
        }
    
        // console.log("    ~ Liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool is " + ethers.formatUnits(tokenOutLiquidity, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 6"); 
    } catch (error) {
        // console.log("    ~ Could not find liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool on Aggre Child 6");
    }

    return tokenOutLiquidity
};

const getPoolAddressInAggreChildSyncSwap = async (provider, tokenIn, tokenOut) => {
    const classicPoolFactoryContract = new ethers.Contract(contracts.children.aggreChildSyncSwap.classicPoolFactory.address, contracts.children.aggreChildSyncSwap.classicPoolFactory.abi, provider);
    const stablePoolFactoryContract = new ethers.Contract(contracts.children.aggreChildSyncSwap.stablePoolFactory.address, contracts.children.aggreChildSyncSwap.stablePoolFactory.abi, provider);

    let poolAddress = "0x0000000000000000000000000000000000000000";

    try {
        if(tokenIn.isStable && tokenOut.isStable) {
            poolAddress = await stablePoolFactoryContract.getPool(tokenIn.address, tokenOut.address);
        } else {
            poolAddress = await classicPoolFactoryContract.getPool(tokenIn.address, tokenOut.address);
        }
    } catch (error) {}

    return poolAddress;
}

const getRouteAmountOutInAggreChildSyncSwap = async (provider, tokenIn, tokenOut, amountIn) => {
    const aggreAggregatorContract = new ethers.Contract(contracts.aggreAggregator.address, contracts.aggreAggregator.abi, provider);
    const classicPoolFactoryContract = new ethers.Contract(contracts.children.aggreChildSyncSwap.classicPoolFactory.address, contracts.children.aggreChildSyncSwap.classicPoolFactory.abi, provider);
    const stablePoolFactoryContract = new ethers.Contract(contracts.children.aggreChildSyncSwap.stablePoolFactory.address, contracts.children.aggreChildSyncSwap.stablePoolFactory.abi, provider);

    const feeAddress = await aggreAggregatorContract.feeAddress();
    let poolAddress = "0x0000000000000000000000000000000000000000";
    let poolContract = null;
    let amountOut;

    try {
        if(tokenIn.isStable && tokenOut.isStable) {
            poolAddress = await stablePoolFactoryContract.getPool(tokenIn.address, tokenOut.address);
        } else {
            poolAddress = await classicPoolFactoryContract.getPool(tokenIn.address, tokenOut.address);
        }
    
        poolContract = new ethers.Contract(poolAddress, abis.syncSwapPoolAbi, provider);

        const result = await poolContract.getAmountOut(tokenIn.address, amountIn, feeAddress);
        amountOut = result;

        // console.log("    ~ Amount out is " + ethers.formatUnits(amountOut, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 6");
    } catch (error) {
        amountOut = 0;
    }

    return amountOut
}

module.exports = { findRouteInAggreChildSyncSwap, getPoolAddressInAggreChildSyncSwap, getRouteAmountOutInAggreChildSyncSwap };