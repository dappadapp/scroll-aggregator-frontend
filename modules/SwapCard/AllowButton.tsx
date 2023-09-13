import type { Currency, Network } from "@/types";
import React, { useState } from "react";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, erc20ABI } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { parseEther } from "ethers";
import { toast } from "react-toastify";
import Button from "@/components/Button";

import addresses from "@/constants/contracts";

type Props = {
  tokenIn: Currency;
  amountIn: number;
  onSuccess: () => void
};

const MAX_ALLOWANCE = BigInt("10000000000000000000000000000000000000000000000000000000000");

const AllowButton: React.FC<Props> = ({ tokenIn, amountIn, onSuccess }) => {
  const { address: account, isConnected } = useAccount();

  const { config: configApprove } = usePrepareContractWrite({
    address: tokenIn.wrapped.address,
    abi: erc20ABI,
    functionName: "approve",
    // args: [addresses.aggregatorContract, BigInt(amountIn) * BigInt(10 ^ tokenIn.decimals)],
    args: [addresses.aggregatorContract, MAX_ALLOWANCE],
  });

  const {
    data: writeContractResult,
    writeAsync: approveAsync,
    error,
    isLoading
  } = useContractWrite(configApprove);

  const handleAllowance = async () => {
    if( approveAsync ) {
      try { 
        const { hash } = await approveAsync();
        await waitForTransaction({ hash });
        toast("Approved!");
        onSuccess();
      } catch(e) {

      }
    } else {
      return toast("Failed to approve!");
    }
  }

  return (
    <Button className="w-full" onClick={handleAllowance} loading={isLoading}>
      Allow Swap
    </Button>
  );
};

export default AllowButton;
