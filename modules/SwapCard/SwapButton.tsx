import type { Network } from "@/types";
import React, { useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { parseEther } from "ethers";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import SwapAbi from "@/constants/abi/Swap.json";
import addresses from "@/constants/contracts";

import LoadingIcon from "@/assets/images/loading.svg";

type Props = {
  swapParams: SwapParam[];
};

export type SwapParam = {
  poolAddress: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOutMin: number;
  swapType: number;
  fee: number;
};

const SwapButton: React.FC<Props> = ({ swapParams }) => {
  const [loading, setLoading] = useState(false);
  const [minTotalAmountOut, setMinTotalAmountOut] = useState(0);
  const [convEth, setConvEth] = useState<boolean>(false);
  const { address: account } = useAccount();

  const { config } = usePrepareContractWrite({
    address: addresses.crossChainSwap as `0x${string}`,
    abi: SwapAbi,
    functionName: "executeSwaps",
    args: [swapParams, parseEther(`${minTotalAmountOut || 0}`), convEth],
  });

  const { writeAsync: onExecuteSwaps, error, isSuccess } = useContractWrite(config);

  const handleSwap = async () => {
    if (!account) {
      return alert("Please connect your wallet first.");
    }
    if (!onExecuteSwaps)
      return alert("Make sure you have enough GAS and you're on the correct network.");
    if (!isSuccess) {
      return alert("An unknown error occured. Please try again.");
    }
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
    <Button onClick={handleSwap}>
      SWAP
      {loading && (
        <LoadingIcon />
      )}
    </Button>
  );
};

export default SwapButton;
