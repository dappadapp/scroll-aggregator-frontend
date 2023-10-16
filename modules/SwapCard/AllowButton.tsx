import type { Currency } from "@/types";
import React from "react";
import { useAccount, useContractWrite, usePrepareContractWrite, erc20ABI } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import useContract from "@/hooks/useContract";

type Props = {
  tokenIn: Currency;
  amountIn: bigint;
  onSuccess: () => void;
};

const AllowButton: React.FC<Props> = ({ tokenIn, amountIn, onSuccess }) => {
  const { address: account, isConnected } = useAccount();
  const contractAddr = useContract();

  const { config: configApprove } = usePrepareContractWrite({
    address: tokenIn.wrapped.address,
    abi: erc20ABI,
    functionName: "approve",
    args: [contractAddr!.contract, amountIn],
    enabled: !!contractAddr,
  });

  const {
    data: writeContractResult,
    writeAsync: approveAsync,
    error,
    isLoading,
  } = useContractWrite(configApprove);

  const handleAllowance = async () => {
    if (approveAsync) {
      try {
        const { hash } = await approveAsync();
        await waitForTransaction({ hash });
        toast("Approved!");
        onSuccess();
      } catch (e) {}
    } else {
      return toast("Failed to approve!");
    }
  };

  return (
    <Button className="w-full" onClick={handleAllowance} loading={isLoading}>
      Allow Swap
    </Button>
  );
};

export default AllowButton;
