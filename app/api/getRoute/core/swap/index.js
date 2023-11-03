import { ethers } from "ethers";
const { tokens, contracts } = require("../../constants");
const { generatePath } = require("../../utils/path");
const { findBestRoute, getPoolAddressInAggreChildren } = require("../search");

export const swap = async (provider, signer, single, tokenInAddress, tokenOutAddress, amountIn, fee, slippage) => {
    const aggreAggregator = new ethers.Contract(contracts.aggreAggregator.address, contracts.aggreAggregator.abi, signer);

    const generatedSwapParams = await generateSwapParams(provider, single, tokenInAddress, tokenOutAddress, amountIn, fee, slippage);

    let totalAmountOut = 0;

    if(generatedSwapParams.length > 0 && generatedSwapParams[0].tokenIn === tokenInAddress && generatedSwapParams[generatedSwapParams.length - 1].tokenOut === tokenOutAddress) {
        let swapValue = BigInt(0);

        swapValue += generatedSwapParams[0].tokenIn === tokens[0].address ? BigInt(amountIn) : BigInt(0);

        console.log("    ~ Executing " + generatedSwapParams.length + " swaps...");

        const swapTransaction = await aggreAggregator.executeSwaps(generatedSwapParams, { value: swapValue }); 
        await swapTransaction.wait();

        const latestBlockNumber = await provider.getBlockNumber();
        const events = await aggreAggregator.queryFilter(aggreAggregator.filters.PathsExecuted(), latestBlockNumber - 100, latestBlockNumber);
        const latestEvent = events[events.length - 1];

        totalAmountOut = latestEvent.args[latestEvent.args.length - 1];
        const totalAmountOutFormatted = Number(ethers.formatUnits(totalAmountOut, tokens.find(token => token.address === generatedSwapParams[generatedSwapParams.length - 1].tokenOut).decimals));

        console.log("    ✔ Swap executed! Congratulations! You got " + totalAmountOutFormatted + " " + tokens.find(token => token.address === generatedSwapParams[generatedSwapParams.length - 1].tokenOut).symbol);
    } else {
        console.log("    x Swap failed! Please try again with a different token pool");
    }

    return totalAmountOut;
};

export const generateSwapParams = async (provider, single, tokenInAddress, tokenOutAddress, amountIn, fee, slippage) => {
    const generatedSwapParams = [];

    let currentTokenIn = tokens.find(token => token.address === tokenInAddress);
    let currentTokenOut = tokens.find(token => token.address === tokenOutAddress);
    let currentAmountIn = amountIn;
    let currentMinAmountOut = 0;
    
    const bestRouteComplete = await findBestRoute(provider, single, currentTokenIn, currentTokenOut, amountIn, fee, slippage);

    for(let i = 0; i < bestRouteComplete.length; i++) { 
        currentTokenIn = bestRouteComplete[i].tokenIn;
        currentTokenOut = bestRouteComplete[i].tokenOut;
        currentAmountIn = bestRouteComplete[i].amountIn;
        currentMinAmountOut = bestRouteComplete[i].bestChildrenRoute.minAmountOut;

        const poolAddress = await getPoolAddressInAggreChildren(provider, bestRouteComplete[i].bestChildrenRoute.childIndex, currentTokenIn, currentTokenOut, bestRouteComplete[i].fee);

        let currentSwapParams = {
            "poolAddress": poolAddress,
            "tokenIn": currentTokenIn.address,
            "tokenOut": currentTokenOut.address,
            "amountIn": currentAmountIn,
            "amountOutMin": currentMinAmountOut,
            "fee": bestRouteComplete[i].fee,
            "path": ethers.ZeroAddress,
            "convertToNative": false,
            "swapType": bestRouteComplete[i].bestChildrenRoute.childIndex
        };

        if(bestRouteComplete[i].bestChildrenRoute.childIndex == 1) {
            currentSwapParams.path = generatePath(currentTokenIn.address, currentTokenOut.address, bestRouteComplete[i].fee);
        }
        
        currentAmountIn = bestRouteComplete[i].bestChildrenRoute.amountOut;

        generatedSwapParams.push(currentSwapParams);
    }
    
    return generatedSwapParams;
}
