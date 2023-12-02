import { useMemo, useState } from "react";
import { useNetwork } from "wagmi";
import useNativeCurrency from "@/hooks/useNativeCurrency";
import { Currency } from "@/types";
import Tokens from "@/constants/tokens";
import { CurrencyLogo } from "./CurrencyLogo";
import _ from "lodash";
import TokenModal from "./TokenModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

type Props = {
  token?: Currency;
  onClick: () => void;
  loading?: boolean;
};

const TokenSelect = ({ token, onClick, loading }: Props) => {
  return (
    <div onClick={loading ? () => {} : onClick} className={"relative flex justify-center items-center xs:w-full w-[92.5%] lg:py-6 md:py-5 sm:py-4 xs:py-3 py-2 lg:px-4 sm:px-3 xs:px-2 px-2 bg-black bg-opacity-[0.15] rounded-2xl transition-all duration-150 hover:bg-white hover:bg-opacity-5 " + (loading ? " pointer-events-none animate-pulse" : "hover:cursor-pointer")}>
      <div
        className="pl-2 flex items-center lg:w-[10rem] md:w-[8.75rem] xs:w-[7.5rem] w-full h-[1.75rem] gap-2 cursor-pointer z-[9999] select-none "
      >
        {token && (
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2 w-full items-center">
              <CurrencyLogo currency={token} />
              <span className={`truncate text-[#FFF] xl:text-xl md:text-lg xs:text-base text-sm font-medium -mb-1 `}>
                {token?.symbol}
              </span>
            </div>
            <FontAwesomeIcon icon={faAngleDown} color="#EBC28E" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenSelect;
