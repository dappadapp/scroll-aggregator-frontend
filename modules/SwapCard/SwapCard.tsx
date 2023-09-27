import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useBalance, useContractRead, useNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { formatUnits, parseUnits } from "viem";
import _, { set } from "lodash";

import Input from "@/components/Input";
import Button from "@/components/Button";
import TokenSelect from "@/components/TokenSelect";
import useNativeCurrency from "@/hooks/useNativeCurrency";
import Tokens from "@/constants/tokens";
import useContract from "@/hooks/useContract";
import { ChainId, Currency, SWAP_TYPE } from "@/types";
import SwapModal from "./SwapModal";
import { UNISWAP_DEFAULT_FEE } from "@/constants/contracts";

import SpaceFiPoolFactoryAbi from "@/constants/abis/spacefi.pool-factory.json";
import SpaceFiRouterAbi from "@/constants/abis/spacefi.router.json";
import { abi as UniswapPoolFactoryAbi } from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import { toFixedValue } from "@/utils/address";
import { ethers } from "ethers";
import SlippageButton from "./SlippageButton";
import axios from "axios";

type Props = {};

const percentageButtons = [25, 50, 75, 100];

const SwapCard: React.FC<Props> = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const contractAddr = useContract();
  const [swapAmount, setSwapAmount] = useState(0);
  const [receiveAmount, setReceiveAmount] = useState("0");
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [dexType, setDexType] = useState<SWAP_TYPE>(SWAP_TYPE.UNISWAP);
  //TODO: Add tokens
  const [tokenFrom, setTokenFrom] = useState<Currency>();
  const [tokenTo, setTokenTo] = useState<Currency | undefined>(
    Tokens[ChainId.SCROLL_SEPOLIA].usdt
  );
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isChangeFrom, setChangeFrom] = useState(true);
  const [rate, setRate] = useState("0");
  const getCurrentRateTimeout = useRef<any>(null);
  const getTokenRateTimeout = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: balanceFrom, isLoading: isLoadingBalanceFrom } = useBalance({
    address: address,
    ...(!tokenFrom?.isNative && {
      token: tokenFrom?.wrapped.address,
    }),
    chainId: tokenFrom?.chainId,
    enabled: !!tokenFrom,
  });

  const { data: balanceTo, isLoading: isLoadingBalanceTo } = useBalance({
    address: address,
    ...(!tokenTo?.isNative && {
      token: tokenTo?.wrapped.address,
    }),
    chainId: tokenTo?.chainId,
    enabled: !!tokenTo,
  });

  const { data: poolAddress } = useContractRead(
    dexType === SWAP_TYPE.SPACEFI
      ? {
          address: contractAddr?.spacefi.poolFactory,
          abi: SpaceFiPoolFactoryAbi,
          functionName: "getPair",
          args: [tokenFrom?.wrapped.address, tokenTo?.wrapped.address],
          enabled: !!contractAddr && !!tokenFrom && !!tokenTo,
        }
      : {
          address: contractAddr?.uniswap.poolFactory,
          abi: UniswapPoolFactoryAbi,
          functionName: "getPool",
          args: [
            tokenFrom?.wrapped.address,
            tokenTo?.wrapped.address,
            UNISWAP_DEFAULT_FEE,
          ],
          enabled: !!contractAddr && !!tokenFrom && !!tokenTo,
        }
  );

  const handleINChange = (e: any) => {
    if (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") {
      setSwapAmount(e.target.value);
      setReceiveAmount(e.target.value);
    } else {
      setSwapAmount(e.target.value);
    }
  };

  const handleOUTChange = (e: any) => {
    if (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") {
      setSwapAmount(e.target.value);
      setReceiveAmount(e.target.value);
    } else {
      setReceiveAmount(e.target.value);
    }
  };

  const getCurrentRate = () => {
    clearTimeout(getCurrentRateTimeout.current!);
    getCurrentRateTimeout.current = setTimeout(async () => {
      if (!tokenFrom || !tokenTo || !swapAmount || swapAmount === 0) return;
      else {
        setIsLoading(true);

        const exchangeRate = await axios.post("/api/exchange", {
          amount: swapAmount.toString(),
          from: tokenFrom?.isNative ? tokenFrom.wrapped.address : tokenFrom?.address,
          to: tokenTo?.isNative ? tokenTo.wrapped.address : tokenTo?.address,
          type: "IN",
        });
        setReceiveAmount(ethers.utils.formatUnits(exchangeRate?.data.amount, 18));
        setIsLoading(false);
      }
    }, 200);
  };
  useEffect(() => {
    getCurrentRate();
  }, [swapAmount, tokenFrom, tokenTo]);

  const getTokenRate = async () => {
    clearTimeout(getTokenRateTimeout.current!);
    getTokenRateTimeout.current = setTimeout(async () => {
      if (!tokenFrom || !tokenTo) return;
      else {
        const exchangeRate = await axios.post("/api/exchange", {
          amount: "1",
          from: tokenFrom.wrapped.address,
          to: tokenTo?.isNative ? tokenTo.wrapped.address : tokenTo?.address,
          type: "IN",
        });
        setRate(ethers.utils.formatUnits(exchangeRate?.data.amount, 18));
      }
    }, 200);
  };

  useEffect(() => {
    getCurrentRate();
    getTokenRate();
  }, [swapAmount, tokenFrom, tokenTo]);

  const native = useNativeCurrency();

  useEffect(() => {
    setTokenFrom(native);
  }, [native]);

  const handleSwitchToken = () => {
    let tokenToA = tokenTo;
    setTokenTo(tokenFrom);
    setTokenFrom(tokenToA);
  };

  const handleClickInputPercent = (percent: number) => {
    if (!balanceFrom || !tokenFrom) return;
    const balance = formatUnits(balanceFrom.value, tokenFrom?.decimals);
    setSwapAmount((parseFloat(balance) * percent) / 100);
    setChangeFrom(true);
  };

  const onKeyDownSwapAmount = () => {
    setChangeFrom(true);
  };

  const onKeyDownReceiveAmount = () => {
    setChangeFrom(false);
  };

  return (
    <div className="w-full max-w-[548px] p-8 gap-2 flex shadow-sm shadow-[#FAC790] flex-col relative border-r border-white/10 bg-white/5 rounded-xl mx-auto my-4">
      <div className={`w-full h-full gap-4 flex-1 flex justify-between flex-col`}>
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-semibold text-xl lg:text-3xl">SWAP</h1>
          <div className="flex">
            <SlippageButton
              onChangeSlippage={(slippageValue: number) => setSlippage(slippageValue)}
              slippage={slippage}
            />
            {/* <Button className="p-3 w-12 h-12 rounded-lg">
              <IconRefresh />
            </Button> */}
          </div>
        </div>
        <div className="relative w-full flex flex-col">
          <span className="text-white/25">from</span>
          <div className="rounded-lg p-4 flex w-full flex-col -mb-1 bg-white/[.04] gap-4 ">
            <div className="flex gap-4 ">
              <div className="w-full">
                <Input
                  onChange={(e) => handleINChange(e)}
                  onKeyDown={onKeyDownSwapAmount}
                  value={swapAmount}
                  type="number"
                  placeholder="Enter Amount"
                  className="w-full crosschainswap-input"
                />
                {balanceFrom && (
                  <div className="mt-2">
                    Balance: {toFixedValue(balanceFrom.formatted, 4)} {balanceFrom.symbol}
                  </div>
                )}
              </div>
              <TokenSelect onChange={setTokenFrom} token={tokenFrom} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {percentageButtons.map((val, index) => (
                <Button
                  className="font-inter text-sm"
                  key={"perc-button-" + index}
                  onClick={() => handleClickInputPercent(val)}
                >
                  {val}%
                </Button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSwitchToken}
            className="w-10 h-10 p-2 my-5 cursor-pointer mx-auto rounded-lg text-white flex items-center justify-center bg-white/[.04] hover:bg-opacity-40 transition-all"
          >
            <FontAwesomeIcon icon={faArrowsUpDown} className="h-6 z-[-1]" />
          </button>
          <span className="text-white/25">to</span>
          <div className="rounded-lg p-4 flex w-full flex-col -mb-1 bg-white/[.04] gap-4">
            <div className="flex gap-4">
              <div className="w-full">
                <Input
                  onChange={(e) => handleOUTChange(e)}
                  onKeyDown={onKeyDownReceiveAmount}
                  value={Number(receiveAmount).toFixed(5)}
                  type="number"
                  loading={isLoading}
                  placeholder="Receive Amount"
                  className="crosschainswap-input w-full"
                />
                {balanceTo && (
                  <div className="mt-2">
                    Balance: {toFixedValue(balanceTo.formatted, 4)} {balanceTo.symbol}
                  </div>
                )}
              </div>
              <TokenSelect onChange={setTokenTo} token={tokenTo} />
            </div>
          </div>
        </div>

        <Button
          variant="bordered"
          disabled={isConnected && (!tokenFrom || !tokenTo || !swapAmount)}
          className="w-full p-4 rounded-lg text-xl font-semibold mt-4"
          onClick={() => (isConnected ? setIsSwapModalOpen(true) : open())}
        >
          {isConnected ? "SWAP" : "CONNECT WALLET"}
        </Button>
      </div>
      {tokenFrom && tokenTo && isSwapModalOpen ? (
        <SwapModal
          pool={poolAddress as string}
          tokenA={tokenFrom}
          tokenB={tokenTo}
          amountA={swapAmount}
          amountB={Number(receiveAmount).toFixed(5)}
          swapType={dexType}
          swapSuccess={() => {
            setSwapAmount(0);
            setReceiveAmount("0");
            setIsSwapModalOpen(false);
          }}
          rate={Number(rate).toFixed(4)}
          onCloseModal={() => setIsSwapModalOpen(false)}
          slippage={slippage}
        />
      ) : null}
    </div>
  );
};

export default SwapCard;
