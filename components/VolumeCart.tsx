import Image from "next/image";
import React from "react";
import VolumeBg from "@/assets/images/volume-bg.png";

type Props = {
  volume_day: number;
  volume_total: number;
};

function VolumeCart(props: Props) {
  return (
    <div className="w-full relative max-w-[413px] justify-between flex flex-col h-[267px] flex-1 gap-6 bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[40px]">
      <Image
        src={VolumeBg}
        alt="volume-bg"
        className="absolute left-0 right-0 w-full h-full object-scale-down rounded-[40px]"
      />
      <div className="flex py-8 px-6 justify-start flex-col w-full items-start gap-4">
        <span className="text-[#FFF0DD] text-lg lg:text-[40px] font-light">
          {props.volume_day}$
        </span>
        <span className="text-[#EBC28E] flex gap-2 text-sm lg:text-[20px]">
          24h Volume <div className="w-4 h-4 rounded-full bg-[#3DAFA5]"></div>
        </span>
      </div>
      <div className="flex p-6 justify-end flex-col items-end gap-4">
        <span className="text-[#FFF0DD] text-lg lg:text-[40px] font-light">
          {props.volume_total}$
        </span>
        <span className="text-[#EBC28E] flex gap-2 text-sm lg:text-[20x]">
          Total Volume <div className="w-4 h-4 rounded-full bg-[#5F6DE7]"></div>
        </span>
      </div>
    </div>
  );
}

export default VolumeCart;
