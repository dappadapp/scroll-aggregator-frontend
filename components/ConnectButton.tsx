"use client";
import React, { useEffect, useState } from "react";
import { formatAddress } from "@/utils/address";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";
import Loading from "@/assets/images/loading.svg";
import { FaWallet } from "react-icons/fa";

const ConnectButton = ({ className }: { className?: string }) => {
  const { open, isOpen } = useWeb3Modal();
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const [ buttonLabel, setButtonLabel ] = useState<string>("Connect Wallet");

  useEffect(() => {
    if (address != undefined && isConnected != undefined) {
      setButtonLabel(isConnected && address ? formatAddress(address) : "Connect Wallet");
    } else {
      setButtonLabel("Connect Wallet");
    }
  }, [address, isConnected])

  return (
    <button
      className={`${className} flex flex-row justify-center items-center rounded-lg bg-[#3DAFA5] text-white tracking-wider duration-150 transition px-6 py-3 xl:text-base xs:text-sm text-xs xl:min-w-[11.5rem] md:min-w-[10rem] md:w-auto xs:w-[9.25rem] w-[7.25rem] xl:max-h-[3rem] md:max-h-[2.75rem] xs:max-h-[2.5rem] max-h-[2rem] font-semibold select-none hover:bg-[#4acfc4]`}
      onClick={open}
    >
      {isOpen ? (
        <div className="flex justify-center items-center xl:w-[1.75rem] w-[1.5rem]">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-row justify-center items-center gap-2">
          <div className="xl:whitespace-normal whitespace-nowrap">{buttonLabel}</div>
          <FaWallet className="-mt-[3px] xs:flex hidden" />
        </div>
      )}
    </button>
  );
};

export default ConnectButton;
