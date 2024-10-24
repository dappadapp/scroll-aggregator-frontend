"use client";
import React, { useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Network, networks } from "@/utils/networks";
import SwapCard from "@/components/SwapCard/SwapCard";
import SwapModal from "@/components/SwapModal";

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [sourceChain, setSourceChain] = useState(networks[0]);
  const [targetChain, setTargetChain] = useState(networks[1]);
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
    <div className={"relative w-full h-screen overflow-x-hidden"}>
      <div className={"absolute z-10 w-full flex h-full flex-col p-2"}>
        <div
          className={
            "container mx-auto md:px-20 gap-2 flex h-full justify-between md:justify-normal flex-col"
          }
        >
          <Navbar />
          <div
            className={
              "md:w-[50%] max-w-full min-h-fit p-10 gap-2 flex flex-col relative border-white/10 border-[2px] bg-white bg-opacity-[4%] rounded-lg mx-auto mt-4"
            }
          >
            <SwapCard
              sourceChain={sourceChain}
              targetChain={targetChain}
              onChangeSourceChain={onChangeSourceChain}
              onChangeTargetChain={onChangeTargetChain}
              onArrowClick={onArrowClick}
            />

            {/* TODO: Graphic  */}
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
              "absolute translate-x-[-20%] left-0 w-1/2 h-full flex flex-col justify-between items-center side"
            }
          >
            <span
              className={
                "absolute bg-[#FFA030]/50 top-0 left-1/2 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>

            <span
              className={
                "absolute bg-[#FFA030]/50 bottom-0 right-0 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>
          </div>
          <div
            className={
              "absolute translate-x-[30%] right-0 w-1/2 h-full flex flex-col justify-between items-center side"
            }
          >
            <span
              className={
                "absolute bg-[#FFA030]/50 top-[30%] left-0 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>

            <span
              className={
                "absolute bg-[#FFA030]/50 top-[60%] left-1/3 h-[200px] aspect-square blur-[80px] rounded-full"
              }
            ></span>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
