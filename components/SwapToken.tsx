import React from "react";
import Image from "next/image";

type Props = {
  image: any;
  token: string;
  value: number;
  flexReverse?: boolean;
};

export const SwapToken: React.FC<Props> = (props) => {
  return (
    <div
      className={`flex items-center gap-2 ${
        props.flexReverse ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Image
        src={props.image}
        alt={props.token + "-swap-img"}
        width={40}
        height={40}
        className="rounded-full md:h-10 md:w-10 w-6 h-6"
      />
      <div className={`flex flex-col text-left`}>
        <span className="text-sm md:text-xl">{props.value}</span>
        <span className="text-[#AAA] text-xs md:text-sm">{props.token}</span>
      </div>
    </div>
  );
};
