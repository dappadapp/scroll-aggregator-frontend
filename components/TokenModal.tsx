import { Currency } from "@/types";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { CurrencyLogo } from "./CurrencyLogo";
import { FaHeart, FaRegStar, FaStar } from "react-icons/fa";
type Props = {
  onCloseModal: () => void;
  token: Currency;
  tokens: Currency[];
  onSelectToken: (token: any) => void;
};

function TokenModal({ onCloseModal, token, onSelectToken, tokens }: Props) {
  const [search, setSearch] = useState("");
  const [filteredToken, setFilteredToken] = useState<any[]>([]);
  const [favTokens, setFavTokens] = useState<any[]>([]);
  const handleFilter = (key: string) => {
    setFilteredToken(
      tokens.filter(
        (tokenX) =>
          tokenX.name?.toLowerCase().includes(key.toLowerCase()) ||
          tokenX.symbol?.toLowerCase().includes(key.toLowerCase())
      )
    );
  };
  useEffect(() => {
    let fav_tokens = JSON.parse(localStorage.getItem("fav_tokens")!) || [];
    setFavTokens(fav_tokens);
  }, []);
  const handleFavToken = (token: string) => {
    if (favTokens.some((tokenX) => tokenX === token)) {
      setFavTokens(favTokens.filter((tokenX) => tokenX !== token));
      localStorage.setItem(
        "fav_tokens",
        JSON.stringify(favTokens.filter((tokenX) => tokenX !== token))
      );
    } else {
      setFavTokens([...favTokens, token]);
      localStorage.setItem("fav_tokens", JSON.stringify([...favTokens, token]));
    }
  };
  return (
    <div
      className={
        "z-[9999] fixed w-full h-full bg-white flex items-center overflow-hidden justify-center backdrop-blur-2xl bg-opacity-10 top-0 left-0"
      }
    >
      <div
        className={
          "z-[9999] p-14 w-[30vw] min-w-[400px] md:min-w-[570px] bg-[rgba(26,29,36,0.80)]  backdrop-blur-[52px] rounded-[48px] border-opacity-10"
        }
      >
        <div className="flex justify-between mb-1">
          <h1 className="text-2xl md:text-4xl mb-2">Select Token</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium hover:bg-white/20 transition-all rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            <FontAwesomeIcon icon={faX} />
          </div>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              handleFilter(e.target.value);
              setSearch(e.target.value);
            }}
            className="w-full px-3 py-2 text-sm lg:text-base lg:py-3 text-gray-100 rounded-3xl placeholder:text-sm placeholder:lg:text-base bg-[rgba(26,29,36,0.50)] focus:ring-1 focus:ring-[#FFF0DD] focus:outline-none"
            placeholder="Search by tokne name or token symbol"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
        <div className=" grid grid-cols-3 mb-4 lg:grid-cols-5 gap-2">
          {favTokens.map((favToken) => (
            <div key={favToken} className="relative group w-full text-sm">
              <div
                onClick={() => {
                  onSelectToken(tokens.find((tokenX) => tokenX.symbol === favToken));
                  onCloseModal();
                }}
                className="flex gap-2 bg hover:bg-[rgba(26,29,36,0.90)] p-2 items-center rounded-xl border border-[#FFF0DD]/50 transition-all cursor-pointer"
              >
                <CurrencyLogo
                  size={4}
                  currency={tokens.find((tokenX) => tokenX.symbol === favToken)}
                />
                <span>{tokens.find((tokenX) => tokenX.symbol === favToken)?.symbol}</span>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavToken(favToken);
                }}
                className="absolute rounded-full w-6 h-6 text-center cursor-pointer items-center justify-center text-[12px] pt-1 pl-[1px] -top-[13px] border border-[#FFF0DD] -right-[13px] group-hover:flex hidden"
              >
                X
              </div>
            </div>
          ))}
        </div>
        <div className="max-h-[400px] mb-4 pt-4 border-t border-[#FFF0DD]/40 overflow-y-auto gap-4 px-2  flex flex-col">
          {(search.length ? filteredToken : tokens).map((tokenX) => (
            <div
              key={tokenX.name}
              onClick={() => {
                onSelectToken(tokenX);
                onCloseModal();
              }}
              className="hover:bg-[rgba(26,29,36,0.40)] rounded-lg text-[#FFF0DD] cursor-pointer p-2 flex items-center justify-between"
            >
              <div className="flex gap-5">
                <CurrencyLogo currency={tokenX} />
                <span>{tokenX.symbol}</span>
              </div>
              {favTokens.some((tokenY) => tokenX.symbol === tokenY) ? (
                <FaStar
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavToken(tokenX.symbol);
                  }}
                  fill={"#FFF0DD "}
                />
              ) : (
                <FaRegStar
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavToken(tokenX.symbol);
                  }}
                  fill={"#fff"}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TokenModal;
