import type { Currency, SWAP_TYPE } from "@/types";
import React, { useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { parseUnits } from "@/utils/address"
import { toast } from "react-toastify";
import Button from "@/components/Button";
import useContract from "@/hooks/useContract";

import AggregatorAbi from "@/constants/abis/aggregator.json";
import WETHAbi from "@/constants/abis/weth.json";


type Props = {
  swapParam: SwapParam;
  tokenIn: Currency;
  tokenOut: Currency;
  swapSuccess: () => void;
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

const SwapButton: React.FC<Props> = ({ swapParam, tokenIn, tokenOut, swapSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [minTotalAmountOut, setMinTotalAmountOut] = useState(0);
  const [convEth, setConvEth] = useState<boolean>(true);
  const contractAddr = useContract();

  const { config } = usePrepareContractWrite({
    address: contractAddr!.contract,
    abi: AggregatorAbi,
    functionName: "executeSwaps",
    args: [[swapParam], parseUnits(`${minTotalAmountOut || 0}`,18), convEth],
    value: tokenIn.isNative ? swapParam.amountIn : undefined,
    enabled: !!contractAddr,
  });

  const { config: configDeposit } = usePrepareContractWrite({
    address: "0x5300000000000000000000000000000000000004",
    abi: WETHAbi,
    functionName: "deposit",
    args: [],
    value: swapParam.amountIn,
    enabled: !!contractAddr,
  });

  const { config: configWithdraw } = usePrepareContractWrite({
    address: "0x5300000000000000000000000000000000000004",
    abi: WETHAbi,
    functionName: "withdraw",
    args: [swapParam.amountIn],
    value: undefined,
    enabled: !!contractAddr,
  });

  const { writeAsync: onExecuteSwaps, error, isSuccess } = useContractWrite(config);

  const { writeAsync: onDeposit } = useContractWrite(configDeposit);

  const { writeAsync: onWithdraw } = useContractWrite(configWithdraw);

  const handleSwap = async () => {
    if (tokenIn?.symbol == "WETH" && tokenOut?.symbol == "ETH") {
      handleWithdraw();
    } else if (tokenIn?.symbol == "ETH" && tokenOut?.symbol == "WETH") {
      handleDeposit();
    } else {
      if (!onExecuteSwaps)
        return alert("Make sure you have enough GAS and you're on the correct network.");
      // if (!isSuccess) {
      //   return alert("An unknown error occured. Please try again.");
      // }
      try {
        setLoading(true);
        const { hash } = await onExecuteSwaps();
        toast("Swap transaction sent!");

        await waitForTransaction({ hash });
        toast("Swap successful!");
        swapSuccess();
      } catch (e) {
        console.log("an error occured while swapping: ", e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeposit = async () => {
    if (!onDeposit)
      return alert("Make sure you have enough GAS and you're on the correct network.");
    // if (!isSuccess) {
    //   return alert("An unknown error occured. Please try again.");
    // }
    try {
      setLoading(true);
      const { hash } = await onDeposit();
      toast("Swap transaction sent!");

      await waitForTransaction({ hash });
      toast("Swap successful!");
      swapSuccess();
    } catch (e) {
      console.log("an error occured while swapping: ", e);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!onWithdraw)
      return alert("Make sure you have enough GAS and you're on the correct network.");
    // if (!isSuccess) {
    //   return alert("An unknown error occured. Please try again.");
    // }
    try {
      setLoading(true);
      const { hash } = await onWithdraw();
      toast("Swap transaction sent!");

      await waitForTransaction({ hash });
      toast("Swap successful!");
      swapSuccess();
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
