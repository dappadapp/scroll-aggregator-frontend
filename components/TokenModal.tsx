import { Currency } from "@/types";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { CurrencyLogo } from "./CurrencyLogo";
import { FaRegStar, FaStar } from "react-icons/fa";
import axios from "axios";
import Loading from "@/assets/images/loading.svg";
import { useAccount, useBalance } from "wagmi";
type Props = {
  onCloseModal: () => void;
  tokenList: Currency[];
  onSelectToken: (token: any) => void;
};

function TokenModal({ onCloseModal, onSelectToken, tokenList }: Props) {
  const [search, setSearch] = useState("");
  const [tokens, setTokens] = useState<any[]>(tokenList);
  const { address } = useAccount();
  const [filteredToken, setFilteredToken] = useState<any[]>([]);
  const [favTokens, setFavTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { data } = useBalance({
    address: address,
    chainId: 534352,
  });
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

  useEffect(() => {
    if (!tokenList) return;
    setLoading(true);
    getScrollTokenBalances().finally(() => setLoading(false));
  }, [address, tokenList]);

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
  const getScrollTokenBalances = async () => {
    const json = await axios(
      `https://blockscout.scroll.io/api?module=account&action=tokenlist&address=${address}`
    )
      .then((response) => response)
      .catch((error) => error.response);

    if (json.status === 200) {
      if (json.data.message === "OK" && json.data.status === "1") {
        const formatted = json.data.result.map((x: any) => ({
          balance: Number(x.balance) / 10 ** Number(x.decimals),
          name: x.name,
          symbol: x.symbol,
          decimals: x.decimals,
          contractAddress: x.contractAddress,
          type: x.type,
        }));
        let listWithBalance = tokens?.map((tokenA) => {
          return {
            ...tokenA,
            balance: formatted.some(
              (formatedToken: any) => formatedToken.symbol === tokenA.symbol
            )
              ? formatted.find(
                  (formatedToken: any) => formatedToken.symbol === tokenA.symbol
                )?.balance
              : 0,
          };
        });
        console.log(listWithBalance);
        setTokens(listWithBalance);
      }
    } else {
      console.log("errorr");
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
          "z-[9999] py-14 px-10 w-[30vw] min-w-[400px] md:min-w-[570px] bg-[rgba(26,29,36,0.80)]  backdrop-blur-[52px] rounded-[48px] border-opacity-10"
        }
      >
        <div className="flex justify-between mb-1 text-white">
          <h1 className="text-white text-2xl md:text-4xl mb-4">Select Token</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium hover:bg-white/20 transition-all rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            <FontAwesomeIcon icon={faX} />
          </div>
        </div>
        <div className="relative mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              handleFilter(e.target.value);
              setSearch(e.target.value);
            }}
            className="w-full px-3 py-2 text-sm lg:text-base lg:py-3 text-gray-100 rounded-3xl placeholder:text-sm placeholder:lg:text-base bg-[rgba(26,29,36,0.50)] focus:ring-1 focus:ring-[#FFF0DD] focus:outline-none"
            placeholder="Search by token name or token symbol"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>

        <div className="grid grid-cols-3 mb-4 lg:grid-cols-4 gap-2 mt-2 p-2">
          {favTokens.map((favToken) => (
            <div key={favToken} className="relative group w-full text-sm text-white">
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
        <div className="max-h-[400px] pt-4 overflow-y-auto gap-4 px-2  flex flex-col mb-4">
          {(search.length ? filteredToken : tokens)
            ?.sort((a: any, b: any) => {
              if (a?.balance > b?.balance) return -1;
              else return 1;
            })
            .map((tokenX) => (
              <div
                key={tokenX.name}
                onClick={() => {
                  onSelectToken(tokenX);
                  onCloseModal();
                }}
                className="hover:bg-[rgba(26,29,36,0.40)] gap-2 rounded-lg text-[#FFF0DD] cursor-pointer p-2 flex items-center justify-between"
              >
                <div className="flex gap-5 items-center">
                  <CurrencyLogo currency={tokenX} />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">{tokenX.symbol}</span>
                    <span className="text-opacity-40 text-xs">{tokenX.name}</span>
                  </div>
                </div>
                {loading ? (
                  <div className="flex justify-end flex-1 items-center text-sm text-black-500 ">
                    <Loading />
                  </div>
                ) : (
                  <div className="flex-1 flex justify-end truncate text-sm">
                    {tokenX.symbol === "ETH"
                      ? Number(data?.formatted).toFixed(4)
                      : tokenX?.balance?.toFixed(4) || 0}
                  </div>
                )}

                {favTokens.some((tokenY) => tokenX.symbol === tokenY) ? (
                  <FaStar
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavToken(tokenX.symbol);
                    }}
                    fill={"#FFF0DD "}
                    className="mb-2"
                  />
                ) : (
                  <FaRegStar
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavToken(tokenX.symbol);
                    }}
                    fill={"#fff"}
                    className="mb-2"
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
