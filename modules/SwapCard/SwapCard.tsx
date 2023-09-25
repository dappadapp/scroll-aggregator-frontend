import React, { useEffect, useMemo, useState } from "react";
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
import { abi as UniswapQuoterAbi } from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import IconSlider from "@/assets/images/icon-sliders.svg";
import IconRefresh from "@/assets/images/icon-refresh.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import { toFixedValue } from "@/utils/address";
import { connectWebSocket, emitData } from "@/utils/websocket";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { ethers } from "ethers";
import SlippageButton from "./SlippageButton";

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

  const [socketUrl, setSocketUrl] = useState("wss://sock.zkl.app/session/" + address);
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

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

  useEffect(() => {
    sendMessage(
      JSON.stringify({
        amount: "" + swapAmount,
        from: tokenFrom?.isNative ? tokenFrom.wrapped.address : tokenFrom?.address,
        to: tokenTo?.isNative ? tokenTo.wrapped.address : tokenTo?.address,
        type: "IN",
      })
    );

    if (
      lastMessage &&
      lastMessage?.data !== "undefined" &&
      lastMessage?.data !== undefined &&
      lastMessage?.data !== ""
    ) {
      const msgData = JSON.parse(lastMessage?.data);
      console.log("msgData", msgData);

      if (msgData) {
        setReceiveAmount((+ethers.formatEther(msgData?.amount)).toFixed(6).toString());

        setDexType(msgData?.dex === "space-fi" ? SWAP_TYPE.SPACEFI : SWAP_TYPE.UNISWAP);
      }
    } else {
      if (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") {
      } else {
        //setReceiveAmount("0");
      }
    }
  }, [swapAmount, tokenFrom, tokenTo, lastMessage]);

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
            <Button className="p-3 w-12 h-12 rounded-lg">
              <IconRefresh />
            </Button>
          </div>
        </div>
        <div className="relative w-full flex flex-col">
          <span className="text-white/25">from</span>
          <div className="rounded-lg p-4 flex w-full flex-col -mb-1 bg-white/[.04] gap-4 z-51">
            <div className="flex gap-4 z-51">
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
            className="w-10 h-10 p-2 my-5 cursor-pointer z-10 mx-auto rounded-lg text-white flex items-center justify-center bg-white/[.04] hover:bg-opacity-40 transition-all"
          >
            <FontAwesomeIcon icon={faArrowsUpDown} className="h-6 z-[-1]" />
          </button>
          <span className="text-white/25">to</span>
          <div className="rounded-lg p-4 flex w-full flex-col -mb-1 bg-white/[.04] gap-4 z-50">
            <div className="flex gap-4 z-50">
              <div className="w-full">
                <Input
                  onChange={(e) => handleOUTChange(e)}
                  onKeyDown={onKeyDownReceiveAmount}
                  value={receiveAmount}
                  type="number"
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
          amountB={receiveAmount}
          swapType={dexType}
          swapSuccess={() => {
            setSwapAmount(0);
            setReceiveAmount("0");
          }}
          rate={rate}
          onCloseModal={() => setIsSwapModalOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default SwapCard;
