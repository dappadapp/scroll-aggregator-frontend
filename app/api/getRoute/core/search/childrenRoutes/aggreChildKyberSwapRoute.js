import { ethers } from "ethers";
const { contracts, abis } = require("../../../constants");

const findRouteInAggreChildKyberSwap = async (provider, tokenIn, tokenOut) => {
    let poolAddress = await getPoolAddressInAggreChildKyberSwap(provider, tokenIn, tokenOut);
    let tokenOutLiquidity = 0;
    
    try {
        const poolContract = new ethers.Contract(poolAddress, abis.kyberSwapPoolAbi, provider);

        const reserves = await poolContract.getReserves();
        const tokenOneAddress = await poolContract.token0();

        if (tokenOneAddress === tokenIn.address) {
            tokenOutLiquidity = reserves[1];
        } else {
            tokenOutLiquidity = reserves[0];
        }
    
        // console.log("    ~ Liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool is " + ethers.formatUnits(tokenOutLiquidity, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 2"); 
    } catch (error) {
        // console.log("    ~ Could not find liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool on Aggre Child 2");
    }

    return tokenOutLiquidity
};

const getPoolAddressInAggreChildKyberSwap = async (provider, tokenIn, tokenOut) => {
    const poolFactoryContract = new ethers.Contract(contracts.children.aggreChildKyberSwap.poolFactory.address, contracts.children.aggreChildKyberSwap.poolFactory.abi, provider);
    
    let poolAddress = "0x0000000000000000000000000000000000000000";

    try {
        poolAddress = await poolFactoryContract.getPool(tokenIn.address, tokenOut.address);
    } catch (error) {}

    return poolAddress;
}

const getRouteAmountOutInAggreChildKyberSwap = async (provider, tokenIn, tokenOut, amountIn, fee) => {
    const kyberSwapQuoterContract = new ethers.Contract(contracts.children.aggreChildKyberSwap.quoter.address, contracts.children.aggreChildKyberSwap.quoter.abi, provider);

    const params = [
        tokenIn.address, 
        tokenOut.address, 
        amountIn, 
        fee >= 1000 ? 300 : fee, 
        0
    ];

    let amountOut;

    try {
        const result = await kyberSwapQuoterContract.callStatic.quoteExactInputSingle(params);
        amountOut = result.returnedAmount;

        // console.log("    ~ Amount out is " + ethers.formatUnits(amountOut, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 2");
    } catch (error) {
        amountOut = 0;
    }

    return amountOut
}

module.exports = { findRouteInAggreChildKyberSwap, getPoolAddressInAggreChildKyberSwap, getRouteAmountOutInAggreChildKyberSwap };