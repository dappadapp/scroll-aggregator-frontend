import type { Network, SWAP_TYPE } from "@/types";
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
import useContract from "@/hooks/useContract";

import AggregatorAbi from "@/constants/abis/aggregator.json";

type Props = {
  swapParam: SwapParam;
};

export type SwapParam = {
  poolAddress: string;
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: bigint;
  amountOutMin: bigint;
  swapType: SWAP_TYPE;
  fee: number;
};

const SwapButton: React.FC<Props> = ({ swapParam }) => {
  const [loading, setLoading] = useState(false);
  const [minTotalAmountOut, setMinTotalAmountOut] = useState(0);
  const [convEth, setConvEth] = useState<boolean>(true);  
  const contractAddr = useContract();
  
  const { config } = usePrepareContractWrite({
    address: contractAddr!.contract,
    abi: AggregatorAbi,
    functionName: "executeSwaps",
    args: [
      [swapParam],
      parseEther(`${minTotalAmountOut || 0}`),
      convEth,
    ],
    enabled: !!contractAddr
  });

  const {
    writeAsync: onExecuteSwaps,
    error,
    isSuccess,
  } = useContractWrite(config);

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
