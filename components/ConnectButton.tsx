"use client";
import React, { useEffect } from "react";
import { formatAddress } from "@/utils/address";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";

import WalletIcon from "@/assets/images/wallet.svg";
import Loading from "@/assets/images/loading.svg";

const ConnectButton = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected, isConnecting, isDisconnected } =
    useAccount();

  return (
    <button
      className={
        "rounded-lg bg-connect_wallet tracking-wider duration-150 hover:bg-black hover:text-white border-black/10 border transition px-3 py-1 sm:px-5 sm:py-2 lg:px-8 lg:py-3 text-white font-semibold select-none text-sm sm:text-base"
      }
      onClick={open}
    >
      {isConnecting ? (
        <div className="flex justify-center items-center text-sm text-black-500 ">
          <Loading />
        </div>
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
