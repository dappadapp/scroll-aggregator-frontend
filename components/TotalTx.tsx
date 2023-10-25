"use client";
import React from "react";
import ProgressBar from "react-customizable-progressbar";

type Props = {
  total_tx: number;
};

function TotalTx(props: Props) {
  return (
    <div className="w-full max-w-[413px] justify-center items-center p-6 flex flex-col h-[267px] flex-1 gap-6 bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[40px]">
      <ProgressBar
        progress={60}
        radius={100}
        strokeColor="#3DAFA5"
        trackStrokeColor="#1A1D24"
        strokeWidth={10}
        trackStrokeWidth={10}
        transition="1.5s ease 0.5s"
        className="w-5 h-5 circular-bar"
      ></ProgressBar>
      <div className="flex p-6 justify-end flex-col items-center gap-4">
        <span className="text-[#FFF0DD] text-base lg:text-[40px] font-light">
          {props.total_tx}
        </span>
        <span className="text-[#EBC28E] flex gap-2 text-sm lg:text-[20x]">
          Total Transactions
        </span>
      </div>
    </div>
  );
}

export default TotalTx;
