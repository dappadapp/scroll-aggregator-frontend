"use client";
import AddressesCart from "@/components/AddressesCart";
import TotalTx from "@/components/TotalTx";
import VolumeCart from "@/components/VolumeCart";
import { formatAddress } from "@/utils/address";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "@/assets/images/loading.svg";
import { SWAP_TYPE } from "@/types";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
function Page() {
  const [statsData, setStatsData] = useState<any>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getStatsData().finally(() => setLoading(false));
  }, []);
  const getStatsData = async () => {
    const response = await axios.get("/api/stats");
    setStatsData(response.data);
  };
  const timestampToDate = (timestamp: string) => {
    let today = new Date(timestamp);

    let date =
      today.getDate() +
      "-" +
      (today.getMonth() + 1).toString() +
      "-" +
      today.getFullYear();
    return date;
  };
  return loading ? (
    <div className="flex w-full flex-col mt-10 gap-12 h-[300px] text-[#FFF0DD] justify-center items-center lg:mt-12 mb-10">
      <Loading />
    </div>
  ) : (
    <div className="flex w-full flex-col gap-12 text-[#FFF0DD] justify-start lg:mt-12 mb-10 mt-10">
        <h1 className="text-lg lg:text-[64px] font-bold">Statistics</h1>
    {/*  
      <span className="lg:text-base font-normal">
      The stats page of a DEX aggregator 
      The stats page of the <span className="text-[#FF7C5C]">Aggre</span>, provides users with a comprehensive overview of the platform's performance and key metrics.{" "}
        <span className="text-[#FF7C5C]">Optimized Routing. </span>
        It offers real-time data on trading volume, liquidity, transaction fees, and historical price trends, 
        <span className="text-[#FF7C5C]">  empowering traders</span> to make informed decisions and monitor the health of the  
        <span className="text-[#FF7C5C]"> decentralized exchange ecosystem.</span>
      </span>

      */} 
      <div className="flex flex-col lg:flex-row justify-center gap-4">
        <VolumeCart
          volume_day={Number(Number(statsData?.volume24h).toFixed(2))}
          volume_total={Number(Number(statsData?.totalVolume).toFixed(2))}
        />
        <TotalTx total_tx={statsData?.totalTxCount} />
        <AddressesCart addresses={statsData?.wallets} />
      </div>
      <table className="overflow-y-scroll border-separate border-spacing-y-1 lg:text-xl text-xs w-full">
        <tbody className="overflow-y-scroll block table-fixed w-full mx-auto h-[auto]">
          <tr className="bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[48px] w-[80%] text-[#FFF0DD] ">
            <td className="overflow-hidden whitespace-nowrap w-[12%] pl-2 py-3">Dex</td>
            <td className="overflow-hidden  whitespace-nowrap w-[12%]  py-3">Address</td>
            <td className="table-cell py-3 w-[12%]">Transaction</td>
            <td className=" hidden lg:table-cell py-3 w-[12%]">From Amount</td>
            <td className=" hidden lg:table-cell py-3 w-[12%]">To Amount</td>
            <td className=" hidden lg:table-cell  py-3 w-[15%]">To Token</td>
            <td className=" hidden lg:table-cell  py-3 w-[15%]">From Token</td>
            <td className=" table-cell text-right py-3 w-[10%] pr-2">Timestamp</td>
          </tr>
          {statsData?.last20tx?.map((item: any, index: number) => {
            return (
              <tr
                key={item?.tx?.txHash}
                className={`pt-4 w-[80%] bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] shadow-inner rounded-lg `}
              >
                <td className="table-cell w-[12%] pl-2 py-2 rounded-l-2xl first-letter:uppercase">
                  {SWAP_TYPE[Number(item?.tx?.dexType)]?.toLowerCase() || "Unknown"}
                </td>
                <td className="lg:text-base table-cell ">
                  {formatAddress(item?.tx?.userWalletAddress)}
                </td>
                <td className="lg:text-base table-cell w-[12%]">
                  <a
                    href={`https://blockscout.scroll.io/tx/${item?.tx?.txHash}`}
                    className="underline"
                  >
                    {formatAddress(item?.tx?.txHash)}
                  </a>
                </td>
                <td className="lg:text-base hidden lg:table-cell w-[12%] ">
                  {item?.outUsd.toFixed(2)}$
                </td>
                <td className="hidden lg:table-cell lg:text-base w-[15%]">
                  {item?.inUsd.toFixed(2)}$
                </td>
                <td className="hidden lg:table-cell  w-[15%] lg:text-base">
                  {formatAddress(item?.tx?.toTokenAddress)}
                </td>
                <td className="hidden lg:table-cell  w-[15%] lg:text-base">
                  {formatAddress(item?.tx?.fromTokenAddress)}
                </td>
                <td className=" text-right w-[10%] lg:text-base pr-2 py-2">
                  {timestampToDate(item?.tx?.timestamp)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Page;
