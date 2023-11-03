const { findRouteInAggreChildIziSwap, getRouteAmountOutInAggreChildIziSwap } = require("./aggreChildIziSwapRoute");
const { findRouteInAggreChildKyberSwap, getRouteAmountOutInAggreChildKyberSwap } = require("./aggreChildKyberSwapRoute");
const { findRouteInAggreChildPunkSwap, getRouteAmountOutInAggreChildPunkSwap } = require("./aggreChildPunkSwapRoute");
const { findRouteInAggreChildSkyDrome, getRouteAmountOutInAggreChildSkyDrome } = require("./aggreChildSkyDromeRoute");
const { findRouteInAggreChildSpaceFi, getRouteAmountOutInAggreChildSpaceFi } = require("./aggreChildSpaceFiRoute");
const { findRouteInAggreChildSyncSwap, getRouteAmountOutInAggreChildSyncSwap } = require("./aggreChildSyncSwapRoute");
const { findRouteInAggreChildCoffeeSwap, getRouteAmountOutInAggreChildCoffeeSwap } = require("./aggreChildCoffeeSwapRoute");
const { findRouteInAggreChildPapyrusSwap, getRouteAmountOutInAggreChildPapyrusSwap } = require("./aggreChildPapyrusSwapRoute");
const { findRouteInAggreChildSushiSwap, getRouteAmountOutInAggreChildSushiSwap } = require("./aggreChildSushiSwapRoute");

const findRouteInAggreChild = async (contractsUpdated, provider, childId, tokenIn, tokenOut, fee) => {
    switch (childId) {
        case 1:
            return await findRouteInAggreChildIziSwap(contractsUpdated,provider, tokenIn, tokenOut, fee);
        case 2:
            return await findRouteInAggreChildKyberSwap(contractsUpdated, provider, tokenIn, tokenOut);
        case 3:
            return await findRouteInAggreChildPunkSwap(contractsUpdated, provider, tokenIn, tokenOut);
        case 4:
            return await findRouteInAggreChildSkyDrome(contractsUpdated, provider, tokenIn, tokenOut);
        case 5:
            return await findRouteInAggreChildSpaceFi(contractsUpdated, provider, tokenIn, tokenOut);
        case 6:
            return await findRouteInAggreChildSyncSwap(contractsUpdated, provider, tokenIn, tokenOut);
        case 7:
            return await findRouteInAggreChildCoffeeSwap(contractsUpdated, provider, tokenIn, tokenOut);
        case 8:
            return await findRouteInAggreChildPapyrusSwap(contractsUpdated, provider, tokenIn, tokenOut);
        case 9:
            return await findRouteInAggreChildSushiSwap(contractsUpdated, provider, tokenIn, tokenOut);
        default:
            return await findRouteInAggreChildIziSwap(contractsUpdated, provider, tokenIn, tokenOut);
    }
};

const getRouteAmountOutInAggreChild = async (contractsUpdated, provider, childId, tokenIn, tokenOut, amountIn, fee) => {
    switch (childId) {
        case 1:
            return await getRouteAmountOutInAggreChildIziSwap(contractsUpdated, provider, tokenIn, tokenOut, amountIn, fee);
        case 2:
            return await getRouteAmountOutInAggreChildKyberSwap(contractsUpdated, provider, tokenIn, tokenOut, amountIn, fee);
        case 3:
            return await getRouteAmountOutInAggreChildPunkSwap(contractsUpdated, provider, tokenIn, tokenOut, amountIn);
        case 4:
            return await getRouteAmountOutInAggreChildSkyDrome(contractsUpdated, provider, tokenIn, tokenOut, amountIn);
        case 5:
            return await getRouteAmountOutInAggreChildSpaceFi(contractsUpdated, provider, tokenIn, tokenOut, amountIn);
        case 6:
            return await getRouteAmountOutInAggreChildSyncSwap(contractsUpdated, provider, tokenIn, tokenOut, amountIn);
        case 7:
            return await getRouteAmountOutInAggreChildCoffeeSwap(contractsUpdated, provider, tokenIn, tokenOut, amountIn);
        case 8:
            return await getRouteAmountOutInAggreChildPapyrusSwap(contractsUpdated, provider, tokenIn, tokenOut, amountIn);
        case 9:
            return await getRouteAmountOutInAggreChildSushiSwap(contractsUpdated, provider, tokenIn, tokenOut, amountIn);
        default:
            return await getRouteAmountOutInAggreChildIziSwap(contractsUpdated, provider, tokenIn, tokenOut, amountIn);
    }
};

module.exports = { findRouteInAggreChild, getRouteAmountOutInAggreChild };