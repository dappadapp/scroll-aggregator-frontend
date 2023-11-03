import { Currency, SWAP_TYPE } from "@/types";
import React, { useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { parseUnits } from "@/utils/address";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import useContract from "@/hooks/useContract";

import AggregatorAbi from "@/constants/abis/aggregator.json";
import WETHAbi from "@/constants/abis/weth.json";
import axios from "axios";

import tokens from "../../app/api/getRoute/constants/tokens";
import {generatePath} from "../../app/api/getRoute/utils/path";

import contracts from "../../app/api/getRoute/constants/contracts";


import {generateSwapParams} from "../../app/api/getRoute/core/swap";


type Props = {
  swapParam: SwapParam;
  tokenIn: Currency;
  tokenOut: Currency;
  swapSuccess: () => void;
  signer?: any;
};

export type SwapParam = {
  poolAddress: string;
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: bigint;
  amountOutMin: any;
  swapType: SWAP_TYPE;
  path: string;
  fee: number;
};

const SwapButton: React.FC<Props> = ({ swapParam, tokenIn, tokenOut, swapSuccess, signer }) => {
  const [loading, setLoading] = useState(false);
  const [minTotalAmountOut, setMinTotalAmountOut] = useState(0);
  const [convEth, setConvEth] = useState<boolean>(true);
  const contractAddr = useContract();
  const { address: userWallet } = useAccount();



  const { config } = usePrepareContractWrite({
    address: contractAddr!.contract,
    abi: AggregatorAbi,
    functionName: "executeSwaps",
    args: [[swapParam], parseUnits(`${minTotalAmountOut || 0}`, 18), convEth],
    value: tokenIn.isNative ? swapParam.amountIn : undefined,
    enabled: !!contractAddr,
  });

  const { config: configDeposit } = usePrepareContractWrite({
    address: "0x5300000000000000000000000000000000000004",
    abi: WETHAbi,
    functionName: "deposit",
    args: [],
    value: swapParam.amountIn,
    enabled: !!contractAddr && tokenIn?.symbol === "ETH" && tokenOut?.symbol === "WETH",
  });

  const { config: configWithdraw } = usePrepareContractWrite({
    address: "0x5300000000000000000000000000000000000004",
    abi: WETHAbi,
    functionName: "withdraw",
    args: [swapParam.amountIn],
    value: undefined,
    enabled: !!contractAddr && tokenIn?.symbol === "WETH" && tokenOut?.symbol === "ETH",
  });

  const { writeAsync: onExecuteSwaps, error, isSuccess } = useContractWrite(config);

  const { writeAsync: onDeposit } = useContractWrite(configDeposit);

  const { writeAsync: onWithdraw } = useContractWrite(configWithdraw);
  const postCreateSwap = async (hash: string) => {
    await axios.post("/api/create", {
      wallet: userWallet,
      txHash: hash,
      fromTokenAddress: swapParam.tokenIn,
      toTokenAddress: swapParam.tokenOut,
      fromAmount: (swapParam.amountOutMin).toString(),
      toAmount: (swapParam.amountIn).toString(),
      chainId: tokenIn.chainId.toString(),
      sourceDex: swapParam.poolAddress,
      dexType: swapParam.swapType.toString(),
    });
  };

  const handleSwap = async () => {

    console.log("signeraaaa: ", signer?.provider);

    const provider = signer;
    const single = true;

    console.log("swapParam: ", swapParam);

    console.log("contracts: ", contracts.aggreAggregator.abi)
    
    const amountIn = "100000000000000000";

    const generatedSwapParams = await generateSwapParams(contracts, provider, single, swapParam.tokenIn,  swapParam.tokenOut, amountIn, 0, 0.5);

    console.log("generatedSwapParams: ", generatedSwapParams);
    if (tokenIn?.symbol === "WETH" && tokenOut?.symbol === "ETH") {
      await handleWithdraw();
    } 
    
    if (tokenIn?.symbol === "ETH" && tokenOut?.symbol === "WETH") {
      await handleDeposit();
    } else {
      if (!onExecuteSwaps) {
        toast.error("Make sure you have enough GAS and you're on the correct network.");
        return;
      }

  


     
      // if (!isSuccess) {
      //   return alert("An unknown error occured. Please try again.");
      // }
      try {
        setLoading(true);
        const { hash } = await onExecuteSwaps();
        toast("Swap transaction sent!");
        const txData = await waitForTransaction({ hash });
        toast("Swap successful!");
        swapSuccess();
        await postCreateSwap(hash);
      } catch (e) {
        console.log("an error occured while swapping: ", e);
        return toast("Failed to Swap!");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeposit = async () => {

    // if (!isSuccess) {
    //   return alert("An unknown error occured. Please try again.");
    // }
    try {
      if (!onDeposit) {
        toast.error("Make sure you have enough GAS and you're on the correct network.");
        return;
      }
      setLoading(true);
      const { hash } = await onDeposit();
      toast("Swap transaction sent!");
      await waitForTransaction({ hash });
      toast("Swap successful!");
      swapSuccess();
      await postCreateSwap(hash);
    } catch (e) {
      console.log("an error occured while swapping: ", e);
    } finally {
      setLoading(false);
    }
  };
  const handleWithdraw = async () => {
 
    // if (!isSuccess) {
    //   return alert("An unknown error occured. Please try again.");
    // }
    try {
      if (!onWithdraw) {
        toast.error("Make sure you have enough GAS and you're on the correct network.");
        return;
      }
      setLoading(true);
      const { hash } = await onWithdraw();
      toast("Swap transaction sent!");
      await waitForTransaction({ hash });
      toast("Swap successful!");
      swapSuccess();
      await postCreateSwap(hash);
    } catch (e) {
      console.log("an error occured while swapping: ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full" onClick={handleSwap} loading={loading} disabled={loading}>
      SWAP
    </Button>
  );
};

export default SwapButton;
