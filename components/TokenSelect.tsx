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
};

const TokenSelect = ({ token, onClick }: Props) => {
  return (
    <div className="relative">
      <div
        onClick={onClick}
        className="pl-4 flex items-center gap-2 cursor-pointer z-10 "
      >
        {token && (
          <>
            <div className="flex gap-2 w-20 items-center lg:w-32">
              <CurrencyLogo currency={token} />
              <span className={`truncate text-[#FFF] text-xs lg:text-2xl font-medium `}>
                {token?.symbol}
              </span>
            </div>
            <FontAwesomeIcon icon={faAngleDown} color="#EBC28E" />
          </>
        )}
      </div>
    </div>
  );
};

export default TokenSelect;
