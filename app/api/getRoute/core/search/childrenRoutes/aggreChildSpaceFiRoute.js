import { ethers } from "ethers";
const { contracts, abis } = require("../../../constants");

const findRouteInAggreChildSpaceFi = async (provider, tokenIn, tokenOut) => {
    let poolAddress = await getPoolAddressInAggreChildSpaceFi(provider, tokenIn, tokenOut);
    let tokenOutLiquidity = 0;
    
    try {
        const poolContract = new ethers.Contract(poolAddress, abis.spaceFiPoolAbi, provider);

        const reserves = await poolContract.getReserves();
        const tokenOneAddress = await poolContract.token0();

        if (tokenOneAddress === tokenIn.address) {
            tokenOutLiquidity = reserves[1];
        } else {
            tokenOutLiquidity = reserves[0];
        }
    
        // console.log("    ~ Liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool is " + ethers.formatUnits(tokenOutLiquidity, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 5"); 
    } catch (error) {
        // console.log("    ~ Could not find liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool on Aggre Child 5");
    }

    return tokenOutLiquidity
};

const getPoolAddressInAggreChildSpaceFi = async (provider, tokenIn, tokenOut) => {
    const poolFactoryContract = new ethers.Contract(contracts.children.aggreChildSpaceFi.poolFactory.address, contracts.children.aggreChildSpaceFi.poolFactory.abi, provider);
    
    let poolAddress = "0x0000000000000000000000000000000000000000";

    try {
        poolAddress = await poolFactoryContract.getPair(tokenIn.address, tokenOut.address);
    } catch (error) {}

    return poolAddress;
}

const getRouteAmountOutInAggreChildSpaceFi = async (provider, tokenIn, tokenOut, amountIn) => {
    const spaceFiRouterContract = new ethers.Contract(contracts.children.aggreChildSpaceFi.router.address, contracts.children.aggreChildSpaceFi.router.abi, provider);

    let amountOut;
    
    try {
        const result = await spaceFiRouterContract.getAmountsOut(amountIn, [tokenIn.address, tokenOut.address]);
        amountOut = result[1];

        // console.log("    ~ Amount out is " + ethers.formatUnits(amountOut, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 5");
    } catch (error) {
        amountOut = 0;
    }

    return amountOut
}

module.exports = { findRouteInAggreChildSpaceFi, getPoolAddressInAggreChildSpaceFi, getRouteAmountOutInAggreChildSpaceFi };