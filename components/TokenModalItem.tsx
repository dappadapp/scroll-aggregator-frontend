import React, { useEffect } from "react";
import { CurrencyLogo } from "./CurrencyLogo";
import { Currency } from "@/types";
import { useAccount, useBalance } from "wagmi";
import { FaRegStar, FaStar } from "react-icons/fa";
import { scroll } from "viem/chains";

function TokenModalItem({
  onSelectToken,
  onCloseModal,
  token,
  favTokens,
  handleFavToken,
}: {
  onCloseModal: () => void;
  tokenList: Currency[];
  onSelectToken: (token: any) => void;
  token: any;
  handleFavToken: (token: string) => void;
  favTokens: any[];
}) {
  const { address } = useAccount();
  const { data, isLoading } = useBalance({
    address: address,
    token: token.address,
    chainId: scroll.id,
  });

  return (
    <div
      key={token.name}
      onClick={() => {
        onSelectToken(token);
        onCloseModal();
      }}
      className="hover:bg-white hover:bg-opacity-10 gap-2 rounded-2xl transition-all duration-150 ease-in-out text-[#FFF0DD] cursor-pointer py-2 xs:px-4 px-2 flex items-center justify-between"
    >
      <div className="flex gap-5 items-center">
        <CurrencyLogo size={8} currency={token} />
        <div className="flex flex-col gap-1">
          <span className="lg:text-lg text-sm font-bold ">{token.symbol}</span>
          <span className="text-opacity-40 lg:text-sm text-xs">{token.name}</span>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center">
        {isLoading ? (
          <div className="-mt-1 mr-3 rounded-full text-black-500 w-[5rem] h-[1.625rem] animate-pulse bg-white opacity-5 xs:flex hidden"></div>
        ) : (
          <div className="flex-1 -mt-1 justify-end mr-3 truncate text-sm lg:text-lg font-bold xs:flex hidden ">
            {data ? Number(data?.formatted).toFixed(4) : "0.000"}
          </div>
        )}

        {favTokens.some((tokenY) => token.symbol === tokenY) ? (
          <FaStar
            onClick={(e) => {
              e.stopPropagation();
              handleFavToken(token.symbol);
            }}
            fill={"#FFF0DD "}
            className="mb-2"
          />
        ) : (
          <FaRegStar
            onClick={(e) => {
              e.stopPropagation();
              handleFavToken(token.symbol);
            }}
            fill={"#fff"}
            className="mb-2"
          />
        )}
      </div>
    </div>
  );
}

export default TokenModalItem;
