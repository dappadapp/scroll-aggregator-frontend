import { Fragment, useEffect, useMemo, useState } from "react";
import { useNetwork } from "wagmi";
import Image from "next/image";
import DropdownSelect from "./DropdownSelect";
import useNativeCurrency from "@/hooks/useNativeCurrency";
import { Currency } from "@/types";
import Tokens from "@/constants/tokens";
import { CurrencyLogo } from "./CurrencyLogo";
import _ from "lodash";

type Props = {
  token?: Currency;
  onChange: (token: any) => void;
  className?: string;
};

const TokenSelect = ({ token, onChange, className }: Props) => {
  const { chain } = useNetwork();
  const native = useNativeCurrency();

  const tokens: Currency[] = useMemo(() => {
    if (chain && Tokens[chain.id]) {
      const tokens = _.values(Tokens[chain.id]);
      return [native, ...tokens];
    }
    return [];
  }, [chain]);

  const handleSearch = (v: string) => {};

  return (
    <DropdownSelect
      value={token}
      onChange={onChange}
      className={`z-[49] px-4 py-3`}
      dropdownClassName={""}
      options={tokens}
      optionRenderer={defaultOptionRenderer}
      onSearch={handleSearch}
    >
      <div className="flex items-center gap-3 w-24">
        {token && (
          <>
            <CurrencyLogo currency={token} />
            <span
              className={`${className} block truncate text-xs md:text-base font-medium z-50`}
            >
              {token?.symbol}
            </span>
          </>
        )}
      </div>
    </DropdownSelect>
  );
};

const defaultOptionRenderer = (option: Currency, selected: any) => (
  <div
    className={`flex items-center gap-2 p-1 ${selected ? "bg-[#2B2B2B] rounded-lg" : ""}`}
  >
    <CurrencyLogo currency={option} />
    <span className="block truncate text-xs md:text-base font-medium">
      {option.symbol}
    </span>
  </div>
);
export default TokenSelect;
