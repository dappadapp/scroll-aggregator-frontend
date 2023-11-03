import { ethers } from "ethers";
const { contracts, abis, tokens } = require("../../../constants");

const findRouteInAggreChildSkyDrome = async (provider, tokenIn, tokenOut) => {
    let poolAddress = await getPoolAddressInAggreChildSkyDrome(provider, tokenIn, tokenOut);
    let tokenOutLiquidity = 0;
    
    try {
        const poolContract = new ethers.Contract(poolAddress, abis.skyDromePoolAbi, provider);

        const reserves = await poolContract.getReserves();
        const tokenOneAddress = await poolContract.token0();

        if (tokenOneAddress === tokenIn.address) {
            tokenOutLiquidity = reserves[1];
        } else {
            tokenOutLiquidity = reserves[0];
        }
    
        // console.log("    ~ Liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool is " + ethers.formatUnits(tokenOutLiquidity, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 4"); 
    } catch (error) {
        // console.log("    ~ Could not find liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool on Aggre Child 4");
    }

    return tokenOutLiquidity
};

const getPoolAddressInAggreChildSkyDrome = async (provider, tokenIn, tokenOut) => {
    const poolFactoryContract = new ethers.Contract(contracts.children.aggreChildSkyDrome.poolFactory.address, contracts.children.aggreChildSkyDrome.poolFactory.abi, provider);
    
    let poolAddress = "0x0000000000000000000000000000000000000000";

    try {
        poolAddress = await poolFactoryContract.getPair(tokenIn.address, tokenOut.address, true);
    } catch (error) {}

    return poolAddress;
}

const getRouteAmountOutInAggreChildSkyDrome = async (provider, tokenIn, tokenOut, amountIn) => {
    const skyDromeRouterContract = new ethers.Contract(contracts.children.aggreChildSkyDrome.router.address, contracts.children.aggreChildSkyDrome.router.abi, provider);

    let amountOut;

    try {
        const result = await skyDromeRouterContract.getAmountsOut(amountIn, [{from: tokenIn.address, to: tokenOut.address, stable: tokenIn.isStable}, {from: tokenOut.address, to: tokenIn.address, stable: tokenOut.isStable }]);
        amountOut = result[1];

        // console.log("    ~ Amount out is " + ethers.formatUnits(amountOut, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 4");
    } catch (error) {
        amountOut = 0;
    }

    return amountOut
}

module.exports = { findRouteInAggreChildSkyDrome, getPoolAddressInAggreChildSkyDrome, getRouteAmountOutInAggreChildSkyDrome };