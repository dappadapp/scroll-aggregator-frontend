"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import CardNavbar from "@/components/CardNavbar";
import SwapCard from "@/modules/SwapCard/SwapCard";
import { AnimatePresence, motion } from "framer-motion";

export default function Home({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined }; }) {
  return (
    <>
      <AnimatePresence>
        <motion.div className="w-full flex-col flex items-center " initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          <CardNavbar />
        </motion.div>
      </AnimatePresence>
      <div className="fle justify-center items-center w-full relative lg:px-0 px-4 h-full">
        <AnimatePresence>
          <motion.div className="absolute flex justify-center items-start top-0 left-0 right-0 w-full select-none pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.075 }}>
            <Image priority quality={100} src="/app-bg.png" alt="app-bg" width={2760} height={2100} className="absolute -z-[1] lg:mt-[4.25rem] md:mt-[8.25rem] xs:mt-[10.25rem] mt-[12.25rem] max-w-[1056px] w-full scale-[1.075] object-contain"/>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div className="flex items-center w-full h-full" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25 }}>
            <SwapCard />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
