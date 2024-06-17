import { Currency } from "@/types";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { CurrencyLogo } from "./CurrencyLogo";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import TokenModalItem from "./TokenModalItem";

type Props = {
  onCloseModal: () => void;
  tokenList: Currency[];
  onSelectToken: (token: any) => void;
};

function TokenModal({ onCloseModal, onSelectToken, tokenList }: Props) {
  const [search, setSearch] = useState("");
  const [tokens, setTokens] = useState<any[]>(tokenList);
  const [filteredToken, setFilteredToken] = useState<any[]>([]);
  const [favTokens, setFavTokens] = useState<any[]>([]);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCloseModal]);

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
    let fav_tokens = JSON.parse(localStorage.getItem("fav_tokens")!) || [
      "ETH",
      "WETH",
      "USDC",
      "USDT",
    ];
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
      if (favTokens.length >= 4) {
        toast.error("You can only add up to 4 favorite tokens");
        return;
      }

      setFavTokens([...favTokens, token]);
      localStorage.setItem("fav_tokens", JSON.stringify([...favTokens, token]));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={
        "z-[9999] fixed w-full min-h-full lg:body-lg modal-bg flex items-center justify-center top-0 left-0 pb-[2.5rem]"
      }
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        ref={modalRef}
        className={
          "z-[9999] xs:mt-0 mt-[2.5rem] lg:p-10 sm:p-8 p-6 xl:w-[28rem] lg:w-[26rem] md:w-[24rem] sm:w-[22rem] xs:w-[20rem] w-[75%] max-h-screen min-h-[17.5rem] xl:h-[36rem] lg:h-[34rem] sm:h-[28rem] xs:h-[28rem] h-[26rem] bg-[rgba(26,29,36,0.75)] backdrop-blur-[52px] sm:rounded-[48px] rounded-[32px]"
        }
      >
        <div className="flex justify-between items-center mb-1 text-white">
          <h1 className="text-white lg:text-2xl md:text-xl sm:text-lg xs:text-base text-sm -mb-1">
            Select Token
          </h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium hover:bg-white/10 bg-black/20 transition-all rounded-md flex justify-center items-center cursor-pointer lg:w-10 md:w-9 w-8 lg:h-10 md:h-9 h-8"
          >
            <FontAwesomeIcon icon={faX} className="md:w-4 w-3 md:h-4 h-3" />
          </div>
        </div>
        <div className="relative lg:my-6 my-4">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              if (e.target.value.length < 18) {
                handleFilter(e.target.value.toUpperCase());
                setSearch(e.target.value.toUpperCase());
              }
            }}
            className="w-full px-6 py-2 text-sm lg:text-lg lg:py-3 text-gray-100 rounded-3xl placeholder:text-md placeholder:lg:text-base bg-black bg-opacity-20 focus:ring-2 transition duration-150 focus:ring-[#EBC28E] outline-none"
            placeholder="Enter token name"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 right-5  transform -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
        <div
          className={
            "flex flex-row xs:flex-nowrap flex-wrap items-center xs:gap-3 gap-2 w-full " +
            (favTokens.length > 0
              ? favTokens.length == 4
                ? "justify-evenly pb-6"
                : "xs:justify-start justify-evenly pb-6"
              : "xs:justify-start justify-evenly")
          }
        >
          {favTokens.map((favToken) => (
            <div
              key={favToken}
              className="relative group lg:text-sm text-xs font-bold text-white"
            >
              <div
                onClick={() => {
                  onSelectToken(tokens.find((tokenX) => tokenX.symbol === favToken));
                  onCloseModal();
                }}
                className="flex justify-center items-center gap-2 hover:bg-[rgba(26,29,36,0.90)] max-w-[5.25rem] xs:px-2 px-4 py-2 rounded-xl bg-black bg-opacity-20 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer"
              >
                <CurrencyLogo
                  size={5}
                  currency={tokens.find((tokenX) => tokenX.symbol === favToken)}
                />
                <span className="mt-[4px]">
                  {tokens.find((tokenX) => tokenX.symbol === favToken)?.symbol}
                </span>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavToken(favToken);
                }}
                className="absolute rounded-full w-6 h-6 text-center cursor-pointer items-center justify-center text-[12px] pt-1 pl-[1px] -top-[13px] bg-black bg-opacity-20 hover:bg-white hover:bg-opacity-10 -right-[13px] group-hover:flex hidden"
              >
                X
              </div>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-t-[#FFF0DD]/20"></div>
        <div
          className={
            (favTokens.length > 0
              ? favTokens.length > 2
                ? "xs:max-h-[60%] max-h-[42.5%]"
                : "xs:max-h-[60%] max-h-[55%]"
              : "max-h-[72.5%]") +
            "  py-4 overflow-y-scroll gap-4 no-scrollbar flex flex-col mb-4"
          }
        >
          {(search.length ? filteredToken : tokens)
            // ?.sort((a: any, b: any) => {
            //   if (a?.wrapped?.balance > b?.wrapped?.balance) return -1;
            //   else return 1;
            // })
            .map((tokenX, tokenXIndex) => (
              <TokenModalItem
                key={tokenXIndex}
                favTokens={favTokens}
                handleFavToken={handleFavToken}
                onCloseModal={onCloseModal}
                onSelectToken={onSelectToken}
                token={tokenX}
                tokenList={tokenList}
              />
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TokenModal;
