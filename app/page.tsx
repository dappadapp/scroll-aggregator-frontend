"use client";
import React, { useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Network, networks } from "@/utils/networks";
import SwapCard from "@/components/Swap/SwapCard";
import { Divider } from "@/components/Divider";

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [sourceChain, setSourceChain] = useState(networks[0]);
  const [targetChain, setTargetChain] = useState(networks[1]);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain: connectedChain } = useNetwork();

  const onChangeSourceChain = async (selectedNetwork: Network) => {
    const chain = networks.find((network) => network.name === selectedNetwork.name);
    if (chain) {
      try {
        if (chain.chainId !== connectedChain?.id) {
          await switchNetworkAsync?.(chain.chainId);
        }
        if (chain.name === targetChain.name) {
          setTargetChain(sourceChain);
        }
        setSourceChain(chain);
        toast("Chain changed!");
      } catch (error: any) {
        if (error.code === 4001) {
          toast("You need to confirm the Metamask request in order to switch network.");
          return;
        }
        console.log(error.code);
        toast("An error occured.");
        return;
      }
    }
  };

  const onChangeTargetChain = async (selectedNetwork: Network) => {
    const chain = networks.find((network) => network.name === selectedNetwork.name);
    if (chain) {
      try {
        if (chain.name === sourceChain.name) {
          if (connectedChain?.id !== targetChain.chainId) {
            await switchNetworkAsync?.(targetChain.chainId);
          }
          setSourceChain(targetChain);
        }
        setTargetChain(chain);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onArrowClick = async () => {
    try {
      if (connectedChain?.id !== targetChain.chainId) {
        await switchNetworkAsync?.(targetChain.chainId);
      }
      setSourceChain(targetChain);
      setTargetChain(sourceChain);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={"relative w-full h-[100vh] overflow-x-hidden"}>
      {isSwapModalOpen ? <></> : null}

      <div className={"absolute overflow-y-scroll z-10 w-full flex flex-col p-2"}>
        <div className={"container mx-auto md:px-20 gap-2 flex flex-col"}>
          <Navbar />
          <div
            className={
              "w-full max-w-full min-h-fit flex flex-col md:flex-row relative border-white/10 border-[2px] bg-white bg-opacity-[4%] rounded-lg  gap-1 items-center  mx-auto mt-4"
            }
          >
            <SwapCard
              sourceChain={sourceChain}
              targetChain={targetChain}
              onSwap={() => setIsSwapModalOpen(true)}
              onChangeSourceChain={onChangeSourceChain}
              onChangeTargetChain={onChangeTargetChain}
              onArrowClick={onArrowClick}
            />
            {/* TODO: Graphic  */}
            <div className="flex-[2] w-fit h-fit "></div>
          </div>
          <Footer />
        </div>
      </div>

      {/* ANIMATION */}
      <div className={"absolute w-screen h-full z-[-1]"}>
        <div
          className={
            "flex relative items-center justify-between transition w-full h-full bg-animation"
          }
        >
          <div
            className={
              "absolute translate-x-[-50%] left-0 w-1/2 h-full flex flex-col justify-between items-center side"
            }
          >
            <span
              className={
                "absolute bg-[#FFA030] top-0 left-1/2 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>

            <span
              className={
                "absolute bg-[#FFA030] bottom-0 right-0 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>
          </div>
          <div
            className={
              "absolute translate-x-[50%] right-0 w-1/2 h-full flex flex-col justify-between items-center side"
            }
          >
            <span
              className={
                "absolute bg-[#FFA030] top-[30%] left-0 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>

            <span
              className={
                "absolute bg-[#FFA030] top-[60%] left-1/3 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
