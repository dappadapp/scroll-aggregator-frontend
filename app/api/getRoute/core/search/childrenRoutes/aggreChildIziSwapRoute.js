const { contracts, abis } = require("../../../constants");
const { path } = require("../../../utils");

const findRouteInAggreChildIziSwap = async (provider, tokenIn, tokenOut, fee) => {
    const tokenOutContract = new ethers.Contract(tokenOut.address, abis.erc20Abi, provider);
    let poolAddress = await getPoolAddressInAggreChildIziSwap(provider, tokenIn, tokenOut, fee);

    let tokenOutLiquidity = 0;
    
    if(poolAddress == "0x0000000000000000000000000000000000000000") {
        tokenOutLiquidity = 0;

        // console.log("    ~ Could not find liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool on Aggre Child 1");
    } else {
        tokenOutLiquidity = await tokenOutContract.balanceOf(poolAddress);

        // console.log("    ~ Liquidity of " + tokenOut.symbol + " in " + tokenIn.symbol + "/" +  tokenOut.symbol + " pool is " + ethers.formatUnits(tokenOutLiquidity, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 1"); 
    }

    return tokenOutLiquidity
    
};

const getPoolAddressInAggreChildIziSwap = async (provider, tokenIn, tokenOut, fee) => {
    const liquidityManagerContract = new ethers.Contract(contracts.children.aggreChildIziSwap.liquidityManager.address, contracts.children.aggreChildIziSwap.liquidityManager.abi, provider);
    
    let poolAddress = "0x0000000000000000000000000000000000000000";

    try {
        poolAddress = await liquidityManagerContract.pool(tokenIn.address, tokenOut.address, fee);
    } catch (error) {}

    return poolAddress;
}

const getRouteAmountOutInAggreChildIziSwap = async (provider, tokenIn, tokenOut, amountIn, fee) => {
    const iziSwapQuoterContract = new ethers.Contract(contracts.children.aggreChildIziSwap.quoter.address, contracts.children.aggreChildIziSwap.quoter.abi, provider);

    const swapPath = path.generatePath(tokenIn.address, tokenOut.address, fee);

    let amountOut;

    try {
        const { acquire, } = await iziSwapQuoterContract.swapAmount.staticCall(amountIn, swapPath);
        amountOut = acquire;

        // console.log("    ~ Amount out is " + ethers.formatUnits(amountOut, tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child 1");
    } catch (error) {
        amountOut = 0;
    }

    return amountOut
}

module.exports = { findRouteInAggreChildIziSwap, getPoolAddressInAggreChildIziSwap, getRouteAmountOutInAggreChildIziSwap };