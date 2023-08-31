import type { Network } from "@/utils/networks";
import React, { useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { toast } from "react-toastify";
import SwapAbi from "@/config/Swap.json";
import { Button } from "@/components/Button";
import addresses from "@/utils/addresses";
import { parseEther } from "ethers";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 animate-spin"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      )}
    </Button>
  );
};

export default SwapButton;
