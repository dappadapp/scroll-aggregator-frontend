"use client";
import AddressesCart from "@/components/AddressesCart";
import TotalTx from "@/components/TotalTx";
import VolumeCart from "@/components/VolumeCart";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Page() {
  const [statsData, setStatsData] = useState<any>();
  useEffect(() => {
    getStatsData();
  }, []);
  const getStatsData = async () => {
    const response = await axios.get("/api/stats");
    setStatsData(response.data);
  };
  return (
    <div className="flex w-full flex-col mt-[25px] gap-12 text-[#FFF0DD] justify-start lg:mt-12 mb-10">
      <h1 className="text-lg lg:text-[64px] font-bold">Statistics</h1>
      <span className="text-sm lg:text-base">
        According to the <span className="text-[#FF7C5C]">DAO decision</span>, Instant
        governance functionality has been deprecated in the{" "}
        <span className="text-[#FF7C5C]">V2 Staking protocol. </span>
        Nevertheless, any AGGRE staker can make proposals for parameter changes on the
        <span className="text-[#FF7C5C]"> Governance Forum</span> and vote for them on
        <span className="text-[#FF7C5C]"> Snapshot.</span>
      </span>
      <div className="flex flex-col lg:flex-row justify-center gap-4">
        <VolumeCart
          volume_day={Number(Number(statsData?.volume24h).toFixed(2))}
          volume_total={Number(Number(statsData?.totalVolume).toFixed(2))}
        />
        <TotalTx total_tx={statsData?.totalTxCount} />
        <AddressesCart addresses={statsData?.wallets} />
      </div>
    </div>
  );
}

export default Page;
