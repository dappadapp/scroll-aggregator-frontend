"use client";
import React from "react";
import FaucetCard from "@/modules/FaucetCard/FaucetCard";
import axios, { config } from "@/modules/FaucetCard/configure";

export default function Faucet({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="w-full h-full flex items-center">
      <FaucetCard axios={axios} config={config} />
    </div>
  );
}
