"use client";
import formatAddress from "@/utils/formatAddress";
import { useWeb3Modal } from "@web3modal/react";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import WalletIcon from "@/assets/images/wallet.svg";
import axios from "axios";

type Props = {};

const ConnectButton: React.FC<Props> = () => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const [pendingFilter, setPendingFilter] = React.useState<any[]>([]);

  return (
    <button
      className={
        "rounded-lg bg-connect_wallet tracking-wider duration-150 hover:bg-black hover:text-white border-black/10 border transition px-3 py-1 sm:px-5 sm:py-2 lg:px-8 lg:py-3 text-white font-semibold select-none text-sm sm:text-base"
      }
      onClick={open}
    >
      {pendingFilter.length > 0 ? (
        <span className="ml-2 text-sm text-black-500 flex justify-center items-center">
          <div className="flex px-1 mt-1 justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 animate-spin"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
        </span>
      ) : address ? (
        formatAddress(address)
      ) : (
        <div className="flex items-center gap-2">
          <div>Connect Wallet</div>
          <WalletIcon />
        </div>
      )}
    </button>
  );
};

export default ConnectButton;
