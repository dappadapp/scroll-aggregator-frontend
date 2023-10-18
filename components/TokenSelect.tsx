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
      className={`px-2 lg:px-4 z-15`}
      dropdownClassName={""}
      options={tokens}
      optionRenderer={defaultOptionRenderer}
      onSearch={handleSearch}
    >
      <div className="flex items-center gap-3 w-20 lg:mt-0 mt-1 z-10 lg:w-32 ">
        {token && (
          <>
            <CurrencyLogo currency={token} />
            <span
              className={`${className} block truncate text-xs mt-[4px] lg:text-2xl font-medium `}
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
  <div className={`flex items-center gap-2 p-1 z-10 hover:bg-gray-800/60 rounded-lg`}>
    <CurrencyLogo currency={option} />
    <span className="block truncate text-xs md:text-base font-medium">
      {option.symbol}
    </span>
  </div>
);
export default TokenSelect;
