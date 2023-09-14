import type { Network } from "@/types";
import React, { useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  erc20ABI,
  useContractEvent,
} from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { parseEther } from "ethers";
import { toast } from "react-toastify";
import Button from "@/components/Button";

import AggregatorAbi from "@/constants/abis/aggregator.json";
import addresses from "@/constants/contracts";

type Props = {
  swapParam: SwapParam;
};

export type SwapParam = {
  poolAddress: string;
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: bigint;
  amountOutMin: bigint;
  swapType: number;
  fee: number;
};

const SwapButton: React.FC<Props> = ({ swapParam }) => {
  const [loading, setLoading] = useState(false);
  const [minTotalAmountOut, setMinTotalAmountOut] = useState(0);
  const [convEth, setConvEth] = useState<boolean>(true);
  
  const { config } = usePrepareContractWrite({
    address: addresses.aggregatorContract,
    abi: AggregatorAbi,
    functionName: "executeSwaps",
    args: [
      [swapParam],
      parseEther(`${minTotalAmountOut || 0}`),
      convEth,
    ],
  });

  const {
    writeAsync: onExecuteSwaps,
    error,
    isSuccess,
  } = useContractWrite(config);

  useContractEvent({
    address: addresses.aggregatorContract,
    abi: AggregatorAbi,
    eventName: "SwapExecuted",
    listener(log) {
      console.log(log);
    },
  });

  const handleSwap = async () => {
    if (!onExecuteSwaps)
      return alert(
        "Make sure you have enough GAS and you're on the correct network."
      );
    // if (!isSuccess) {
    //   return alert("An unknown error occured. Please try again.");
    // }
    try {
      setLoading(true);
      const { hash } = await onExecuteSwaps();
      toast("Swap transaction sent!");

      await waitForTransaction({ hash });
      toast("Swap successful!");
    } catch (e) {
      console.log("an error occured while swapping: ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full" onClick={handleSwap} loading={loading}>
      SWAP
    </Button>
  );
};

export default SwapButton;
