import React from "react";
import { Currency } from "@/types";
import { CurrencyLogo } from "./CurrencyLogo";

type Props = {
  currency: Currency;
  value: number;
};

export const SwapToken: React.FC<Props> = (props) => {
  return (
    <div
      className="flex items-center gap-2"
    >
      <CurrencyLogo currency={props.currency} size={8} />
      <div className={`flex flex-col text-left`}>
        <span className="text-sm md:text-xl">{props.value}</span>
        <span className="text-[#AAA] text-xs md:text-sm">{props.currency.symbol}</span>
      </div>
    </div>
  );
};
