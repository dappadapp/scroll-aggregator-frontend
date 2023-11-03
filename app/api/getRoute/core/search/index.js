import { ethers } from "ethers";
const { tokens, settings, contracts } = require("../../constants");
const { getRouteAmountOutInAggreChild, findRouteInAggreChild, getPoolAddressInAggreChild } = require("./childrenRoutes");

export const findBestRoute = async (provider, single, tokenIn, tokenOut, amountIn, fee, slippage) => {
    const aggreAggregator = new ethers.Contract(contracts.aggreAggregator.address, contracts.aggreAggregator.abi, provider);
    const childCount = Number(await aggreAggregator.childIndex()) - 1;
    const maxBestRouteCount = single ? 1 : settings.search.maxBestRouteCount;

    let bestRouteComplete = [];

    console.log("    ----------------------------------------------------------------");
    console.log("    ~ Searching for best route for " + ethers.formatUnits(amountIn, tokenIn.decimals) + " " + tokenIn.symbol + " to " + tokenOut.symbol);

    const directRoute = await findDirectRoute(provider, maxBestRouteCount, childCount, tokenIn, tokenOut, amountIn, fee, slippage);

    if (directRoute.length > 0) {
        bestRouteComplete = directRoute;
    } else {
        let tokenOutRoute = await findTokenOutRoute(provider, maxBestRouteCount, childCount, tokenIn, tokenOut, fee);
        let tokenInRoute = await findTokenInRoute(provider, maxBestRouteCount, childCount, tokenIn, tokenOutRoute, amountIn, fee, slippage);

        tokenOutRoute = await setAmountsInTokenOutRoute(provider, tokenInRoute, tokenOutRoute, fee, slippage);
        bestRouteComplete = await findBestRouteInTokenOutAndInRoute(tokenInRoute, tokenOutRoute); 
    }

    bestRouteComplete = finalCheckForBestRouteComplete(bestRouteComplete, tokenIn, tokenOut);

    return bestRouteComplete;
};

const findDirectRoute = async (provider, maxBestRouteCount, childCount, tokenIn, tokenOut, amountIn, fee, slippage) => {
    const bestRouteComplete = [];

    const directRoute = await findBestRouteInAggreChildren(provider, maxBestRouteCount, childCount, tokenIn, tokenOut, fee, slippage);

    if (directRoute[0].bestChildrenRoute.tokenOutLiquidity > 0) {
        for(let i = 0; i < directRoute.length; i++) {
            directRoute[i].amountIn = ethers.parseUnits(String(ethers.formatUnits(amountIn, tokenIn.decimals) / directRoute.length), tokenIn.decimals);
            directRoute[i].bestChildrenRoute.amountOut = await getRouteAmountOutInAggreChildren(provider, directRoute[i].bestChildrenRoute.childIndex, directRoute[i].tokenIn, directRoute[i].tokenOut, directRoute[i].amountIn, fee);
            directRoute[i].bestChildrenRoute.minAmountOut = calculateMinAmountOut(directRoute[i].tokenOut, directRoute[i].bestChildrenRoute.amountOut, slippage);

            bestRouteComplete.push(directRoute[i]);

            console.log("    ✔ Direct route found for " + ethers.formatUnits(directRoute[i].amountIn, directRoute[i].tokenIn.decimals) + " " + tokenIn.symbol + " to " + ethers.formatUnits(directRoute[i].bestChildrenRoute.minAmountOut, directRoute[i].tokenOut.decimals) + " " + tokenOut.symbol + " on Aggre Child " + directRoute[i].bestChildrenRoute.childIndex);
        }
    } else {
        console.log("    x No direct route found for " + tokenIn.symbol + " to " + tokenOut.symbol + " on any Aggre Child");
    }

    return bestRouteComplete;
}

const findTokenOutRoute = async (provider, maxBestRouteCount, childCount, tokenIn, tokenOut, fee) => {
    let tokenOutRoute = [];

    for(let i = 0; i < tokens.length; i++) {
        if(tokens[i] == tokenIn || tokens[i] == tokenOut) continue;

        const tokenOutRoute = await findBestRouteInAggreChildren(provider, maxBestRouteCount, childCount, tokens[i], tokenOut, fee, 0);

        if (tokenOutRoute[0].bestChildrenRoute.tokenOutLiquidity > 0) {
            tokenOutRoute.push(tokenOutRoute);

            for(let j = 0; j < tokenOutRoute.length; j++) {
                console.log("    ✔ Route found for " + tokens[i].symbol + " to " + tokenOut.symbol + " on Aggre Children " + tokenOutRoute[j].bestChildrenRoute.childIndex);
            }
        } else {
            console.log("    x No route found for " + tokens[i].symbol + " to " + tokenOut.symbol + " on any Aggre Child");
        }
    }

    return tokenOutRoute;
}

const findTokenInRoute = async (provider, maxBestRouteCount, childCount, tokenIn, tokenOutRoute, amountIn, fee, slippage) => {
    let tokenInRoute = [];

    for(let i = 0; i < tokenOutRoute.length; i++) {
        const tokenInRoute = await findBestRouteInAggreChildren(provider, maxBestRouteCount, childCount, tokenIn, tokenOutRoute[i][0].tokenIn, fee, 0);

        if (tokenInRoute[0].bestChildrenRoute.tokenOutLiquidity > 0) {
            for(let j = 0; j < tokenInRoute.length; j++) {
                tokenInRoute[j].amountIn = ethers.parseUnits(String(ethers.formatUnits(amountIn, tokenInRoute[j].tokenIn.decimals) / tokenInRoute.length), tokenInRoute[j].tokenIn.decimals);
                tokenInRoute[j].bestChildrenRoute.amountOut = await getRouteAmountOutInAggreChildren(provider, tokenInRoute[j].bestChildrenRoute.childIndex, tokenInRoute[j].tokenIn, tokenInRoute[j].tokenOut, tokenInRoute[j].amountIn, fee);
                tokenInRoute[j].bestChildrenRoute.minAmountOut = calculateMinAmountOut(tokenInRoute[j].tokenOut, tokenInRoute[j].bestChildrenRoute.amountOut, slippage);
                
                console.log("    ✔ Route found for " + tokenInRoute[0].tokenIn.symbol + " to " + tokenInRoute[0].tokenOut.symbol + " on Aggre Children " + tokenInRoute[0].bestChildrenRoute.childIndex);
            }

            tokenInRoute.push(tokenInRoute);
        } else {
            console.log("    x No route found for " + tokenInRoute[0].tokenIn.symbol + " to " + tokenInRoute[0].tokenOut.symbol + " on any Aggre Child");
        }
    }

    return tokenInRoute;
}

const setAmountsInTokenOutRoute = async (provider, tokenInRoute, tokenOutRoute, fee, slippage) => {
    let tokenOutRouteTemp = tokenOutRoute;

    for(let i = 0; i < tokenOutRouteTemp.length; i++) {
        let routesInTokenInRoutes = [];
        let totalAmountInMin = 0;

        for(let k = 0; k < tokenInRoute.length; k++) {
            if(tokenInRoute[k][0].tokenOut == tokenOutRouteTemp[i][0].tokenIn) {
                routesInTokenInRoutes = tokenInRoute[k];
            }
        }

        for(let l = 0; l < routesInTokenInRoutes.length; l++) {
            const totalAmountInMinFormatted = ethers.formatUnits(totalAmountInMin, routesInTokenInRoutes[l].tokenOut.decimals);
            const minAmountOutFormatted = ethers.formatUnits(routesInTokenInRoutes[l].bestChildrenRoute.minAmountOut, routesInTokenInRoutes[l].tokenOut.decimals);
            const sumOfTotalAndMinAmount = (Number(totalAmountInMinFormatted) + Number(minAmountOutFormatted)).toFixed(routesInTokenInRoutes[l].tokenOut.decimals);
            
            totalAmountInMin = ethers.parseUnits(String(sumOfTotalAndMinAmount), routesInTokenInRoutes[l].tokenOut.decimals);
        }

        for(let j = 0; j < tokenOutRouteTemp[i].length; j++) {
            const totalAmountInMinFormatted = ethers.formatUnits(totalAmountInMin, tokenOutRouteTemp[i][j].tokenOut.decimals);
            const totalAmountInMinSubdivided = (Number(totalAmountInMinFormatted) / tokenOutRouteTemp[i].length).toFixed(tokenOutRouteTemp[i][j].tokenOut.decimals);

            tokenOutRouteTemp[i][j].amountIn = ethers.parseUnits(String(totalAmountInMinSubdivided), tokenOutRouteTemp[i][j].tokenOut.decimals);

            tokenOutRouteTemp[i][j].bestChildrenRoute.amountOut = await getRouteAmountOutInAggreChildren(provider, tokenOutRouteTemp[i][j].bestChildrenRoute.childIndex, tokenOutRouteTemp[i][j].tokenIn, tokenOutRouteTemp[i][j].tokenOut, tokenOutRouteTemp[i][j].amountIn, fee);
            tokenOutRouteTemp[i][j].bestChildrenRoute.minAmountOut = calculateMinAmountOut(tokenOutRouteTemp[i][j].tokenOut, tokenOutRouteTemp[i][j].bestChildrenRoute.amountOut, slippage);
        }
    }

    return tokenOutRouteTemp;
}

const findBestRouteInTokenOutAndInRoute = async (bestRouteComplete, tokenInRoute, tokenOutRoute) => {
    let bestRouteCompleteTemp = bestRouteComplete;
    let bestTotalAmountOut = 0;
    let bestTotalAmountOutRoute = [];

    for(let i = 0; i < tokenInRoute.length; i++) {
        let totalAmountOut = 0;
        let currentTokenOutRoutes = [];

        for (let k = 0; k < tokenOutRoute.length; k++) {
            for (let t = 0; t < tokenOutRoute[k].length; t++) {
                const currentAmountOutFormatted = ethers.formatUnits(tokenOutRoute[k][t].bestChildrenRoute.amountOut, tokenOutRoute[k][t].tokenOut.decimals);
                const sumOfCurrentAndTotalAmountOut = (Number(currentAmountOutFormatted) + Number(totalAmountOut)).toFixed(tokenOutRoute[k][t].tokenOut.decimals);

                if (tokenOutRoute[k][t].tokenIn === tokenInRoute[i][0].tokenOut) {
                    totalAmountOut = sumOfCurrentAndTotalAmountOut;
                    currentTokenOutRoutes = tokenOutRoute[k];
                }
            }
        }

        if(totalAmountOut > bestTotalAmountOut && bestTotalAmountOutRoute.length == 0) {
            bestTotalAmountOut = totalAmountOut;
            
            bestTotalAmountOutRoute.push(tokenInRoute[i]);
            bestTotalAmountOutRoute.push(currentTokenOutRoutes);
        }
    }

    for(let i = 0; i < bestTotalAmountOutRoute.length; i++) {
        for(let j = 0; j < bestTotalAmountOutRoute[i].length; j++) {
            bestRouteCompleteTemp.push(bestTotalAmountOutRoute[i][j]);
        }
    }

    return bestRouteCompleteTemp;
}

const getRouteAmountOutInAggreChildren = async (provider, childId, tokenIn, tokenOut, amountIn, fee) => {
    const amountOut = await getRouteAmountOutInAggreChild(provider, childId, tokenIn, tokenOut, amountIn, fee);

    return amountOut;
}

const calculateMinAmountOut = (tokenOut, amountOut, slippage) => {
    let amountOutMinFormatted = 0;

    if(slippage > 0) {
        let amountOutFormatted = ethers.formatUnits(String(amountOut), tokenOut.decimals);
        let amountOutMin = (Number(amountOutFormatted) - Number(amountOutFormatted * (slippage / 100))).toFixed(tokenOut.decimals);
        amountOutMinFormatted = ethers.parseUnits(String(amountOutMin), tokenOut.decimals);
    }

    return amountOutMinFormatted;
}

const findBestRouteInAggreChildren = async (provider, maxBestRouteCount, childCount, tokenIn, tokenOut, fee) => {
    let childIndexRouteBlacklist = settings.search.childIndexRouteBlacklist;

    let bestChildrenRoutes = [];
    const liquidityThreshold = settings.search.liquidityThreshold;
    const liquidityMin = settings.search.liquidityMin;

    for(let i = 1; i <= childCount; i++) {
        const tokenOutLiquidity = await findRouteInAggreChild(provider, i, tokenIn, tokenOut, fee);

        let blackListed = false;

        for(let j = 0; j < childIndexRouteBlacklist.length; j++) {
            if(i == childIndexRouteBlacklist[j].childIndex && tokenIn == childIndexRouteBlacklist[j].tokenIn && tokenOut == childIndexRouteBlacklist[j].tokenOut) {
                blackListed = true;
                console.log("    x Blacklisted route skipped for " + tokenIn.symbol + " to " + tokenOut.symbol + " on Aggre Children " + i);
                
                break;
            }
        }

        bestChildrenRoutes.push({
            childIndex: i,
            amountOut: 0,
            minAmountOut: 0,
            tokenOutLiquidity: !blackListed && tokenOutLiquidity != undefined ? tokenOutLiquidity : 0
        });
    }

    if(bestChildrenRoutes.length > 0 && bestChildrenRoutes.some(routes => routes.tokenOutLiquidity > ethers.parseUnits(String(liquidityMin), tokenOut.decimals))) {
        let bestChildrenRoutesForLiquidity = bestChildrenRoutes.filter(routes => routes.tokenOutLiquidity > ethers.parseUnits(String(liquidityMin), tokenOut.decimals)).sort((a, b) => ethers.formatUnits(b.tokenOutLiquidity, tokenOut.decimals) - ethers.formatUnits(a.tokenOutLiquidity, tokenOut.decimals)).slice(0, maxBestRouteCount);

        const bestChildrenRouteForLiquidity = bestChildrenRoutesForLiquidity[0];
        const bestChildrenRouteForLiquidityCompareValue = ethers.formatUnits(bestChildrenRouteForLiquidity.tokenOutLiquidity, tokenOut.decimals) - (ethers.formatUnits(bestChildrenRouteForLiquidity.tokenOutLiquidity, tokenOut.decimals) * liquidityThreshold);

        bestChildrenRoutes = bestChildrenRoutesForLiquidity.filter(routes => ethers.formatUnits(routes.tokenOutLiquidity, tokenOut.decimals) > bestChildrenRouteForLiquidityCompareValue);
    } else {
        bestChildrenRoutes = [{
            childIndex: 0,
            amountOut: 0,
            minAmountOut: 0,
            tokenOutLiquidity: 0
        }];
    }

    const bestRouteInAggreChildren = [];

    for(let i = 0; i < bestChildrenRoutes.length; i++) {
        const bestChildrenRoute = bestChildrenRoutes[i];

        bestRouteInAggreChildren.push({
            tokenIn,
            tokenOut,
            amountIn: 0,
            bestChildrenRoute,
            fee
        });
    }

    return bestRouteInAggreChildren;
}

const finalCheckForBestRouteComplete = (bestRouteComplete, tokenIn, tokenOut) => {
    let bestRouteCompleteTemp = bestRouteComplete;

    if(bestRouteCompleteTemp.length == 0 || bestRouteCompleteTemp[bestRouteCompleteTemp.length - 1].tokenOut != tokenOut) {
        bestRouteCompleteTemp = [];
        console.log("    x No route found for " + tokenIn.symbol + " to " + tokenOut.symbol + " on any Aggre Child");
    } else {
        console.log("    ----------------------------------------------------------------");
        console.log("    ✔ Best route found for " + tokenIn.symbol + " to " + tokenOut.symbol + " on Aggre Children");
        for (let i = 0; i < bestRouteCompleteTemp.length; i++) {
            console.log("    ✔ Route " + (i + 1) + ": " + ethers.formatUnits(bestRouteCompleteTemp[i].amountIn, bestRouteCompleteTemp[i].tokenIn.decimals) + " " + bestRouteCompleteTemp[i].tokenIn.symbol + " to " + ethers.formatUnits(bestRouteCompleteTemp[i].bestChildrenRoute.minAmountOut, bestRouteCompleteTemp[i].tokenOut.decimals) + " " + bestRouteCompleteTemp[i].tokenOut.symbol + " on Aggre Child " + bestRouteCompleteTemp[i].bestChildrenRoute.childIndex);
        }
        console.log("    ----------------------------------------------------------------");
    }

    return bestRouteCompleteTemp;
}

export const getPoolAddressInAggreChildren = async (provider, childId, tokenIn, tokenOut, fee) => {
    const poolAddress = await getPoolAddressInAggreChild(provider, childId, tokenIn, tokenOut, fee);
    return poolAddress;
}

