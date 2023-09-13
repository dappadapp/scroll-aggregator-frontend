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
};

const TokenSelect = ({ token, onChange }: Props) => {
  const { chain } = useNetwork();
  const native = useNativeCurrency();

  const tokens: Currency[] = useMemo(() => {
    if (chain && Tokens[chain.id]) {
      const tokens = _.values(Tokens[chain.id]);
      return tokens;
    }
    return [];
  }, [chain]);

  const handleSearch = (v: string) => {};

  return (
    <DropdownSelect
      value={token}
      onChange={onChange}
      className="px-4 py-3"
      options={tokens}
      optionRenderer={defaultOptionRenderer}
      onSearch={handleSearch}
    >
      <div className="flex items-center gap-2 w-full w-20">
        {token && (
          <>
            <CurrencyLogo currency={token} />
            <span className="block truncate text-xs md:text-base font-medium">
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
    className={`flex items-center gap-2 p-1 ${
      selected ? "bg-[#2B2B2B] rounded-lg" : ""
    }`}
  >
    <CurrencyLogo currency={option} />
    <span className="block truncate text-xs md:text-base font-medium">
      {option.symbol}
    </span>
  </div>
);
export default TokenSelect;
