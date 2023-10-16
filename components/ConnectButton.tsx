"use client";
import React from "react";
import { formatAddress } from "@/utils/address";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";
import Loading from "@/assets/images/loading.svg";
import { FaWallet } from "react-icons/fa";

const ConnectButton = ({ className }: { className?: string }) => {
  const { open } = useWeb3Modal();
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();

  return (
    <button
      className={`${className} rounded-lg bg-[#3DAFA5] text-white tracking-wider duration-150  transition px-3 py-1 sm:px-5 sm:py-2 lg:px-8 lg:py-3  font-semibold select-none text-sm sm:text-base`}
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
          <FaWallet />
        </div>
      )}
    </button>
  );
};

export default ConnectButton;
