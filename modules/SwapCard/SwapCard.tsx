import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useContractRead, useNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { formatUnits, parseUnits } from "viem";
import _ from "lodash";

import Input from "@/components/Input";
import Button from "@/components/Button";
import TokenSelect from "@/components/TokenSelect";
import DropdownSelect from "@/components/DropdownSelect";
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

type Props = {};

const percentageButtons = [25, 50, 75, 100];

const SwapCard: React.FC<Props> = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const contractAddr = useContract();
  const [swapAmount, setSwapAmount] = useState(0);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [dexType, setDexType] = useState<SWAP_TYPE>(SWAP_TYPE.UNISWAP);
  //TODO: Add tokens
  const [tokenFrom, setTokenFrom] = useState<Currency>();
  const [tokenTo, setTokenTo] = useState<Currency | undefined>(
    Tokens[ChainId.SCROLL_SEPOLIA].mock
  );
  const [isChangeFrom, setChangeFrom] = useState(true);

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

  const { data: outAmounts } = useContractRead(
    true
      ? {
          address: contractAddr?.spacefi.router,
          abi: SpaceFiRouterAbi,
          functionName: "getAmountsOut",
          args: [
            parseUnits(swapAmount.toFixed(10), tokenFrom?.decimals || 18),
            [tokenFrom?.wrapped.address, tokenTo?.wrapped.address],
          ],
          enabled: !!tokenFrom && !!tokenTo && isChangeFrom,
        }
      : {
          address: contractAddr?.uniswap.router,
          abi: UniswapQuoterAbi,
          functionName: "quoteExactInputSingle",
          args: [
            tokenFrom?.wrapped.address,
            tokenTo?.wrapped.address,
            UNISWAP_DEFAULT_FEE,
            parseUnits(swapAmount.toFixed(10), tokenFrom?.decimals || 18),
            0,
          ],
          enabled: !!tokenFrom && !!tokenTo && address && isChangeFrom,
        }
  );

  const { data: inAmounts } = useContractRead(
    true
      ? {
          address: contractAddr?.spacefi.router,
          abi: SpaceFiRouterAbi,
          functionName: "getAmountsIn",
          args: [
            parseUnits(receiveAmount.toFixed(10), tokenTo?.decimals || 18),
            [tokenFrom?.wrapped.address, tokenTo?.wrapped.address],
          ],
          enabled: !!tokenFrom && !!tokenTo && !isChangeFrom,
        }
      : {
          address: contractAddr?.uniswap.router,
          abi: UniswapQuoterAbi,
          functionName: "quoteExactOutputSingle",
          args: [
            tokenFrom?.wrapped.address,
            tokenTo?.wrapped.address,
            UNISWAP_DEFAULT_FEE,
            parseUnits(receiveAmount.toFixed(10), tokenTo?.decimals || 18),
            0,
          ],
          enabled: !!tokenFrom && !!tokenTo && address && isChangeFrom,
        }
  );

  useEffect(() => {
    if (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") {
      setSwapAmount(receiveAmount);
    } else {
      if (!!outAmounts && tokenTo && isChangeFrom) {
        // if( dexType === SWAP_TYPE.SPACEFI ) {
        const amounts = outAmounts as bigint[];
        setReceiveAmount(+(+formatUnits(amounts[1], tokenTo.decimals)).toFixed(10));
        // } else if( dexType === SWAP_TYPE.UNISWAP ) {
        //     setReceiveAmount(+(+formatUnits(outAmounts as bigint, tokenTo.decimals)).toFixed(10))
        // }
      }
    }
  }, [outAmounts, tokenTo, isChangeFrom, dexType]);

  useEffect(() => {
    if (tokenTo?.symbol == "WETH" && tokenFrom?.symbol == "ETH") {
      setReceiveAmount(swapAmount);
    } else {
      if (!!inAmounts && tokenFrom && !isChangeFrom) {
        const amounts = inAmounts as bigint[];
        setSwapAmount(+formatUnits(amounts[0], tokenFrom.decimals));

        // if( dexType === SWAP_TYPE.SPACEFI ) {
        // } else if( dexType === SWAP_TYPE.UNISWAP ) {
        //   setSwapAmount(+(+formatUnits(inAmounts as bigint, tokenFrom.decimals)).toFixed(10))
        // }
      }
    }
  }, [inAmounts, tokenFrom, tokenTo, !isChangeFrom, dexType, swapAmount]);

  const native = useNativeCurrency();

  useEffect(() => {
    setTokenFrom(native);
  }, [native]);

  const handleSwitchToken = () => {
    setTokenFrom(tokenTo);
    setTokenTo(tokenFrom);
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
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-xl lg:text-3xl">SWAP</h1>
          <Button className="p-3 w-12 h-12 rounded-lg ms-auto">
            <IconSlider />
          </Button>
          <Button className="p-3 w-12 h-12 rounded-lg">
            <IconRefresh />
          </Button>
          <DropdownSelect
            value={dexType}
            onChange={(v) => setDexType(v.value)}
            className="px-4 py-3"
            options={[
              { title: "SpaceFi", value: SWAP_TYPE.SPACEFI },
              { title: "Uniswap", value: SWAP_TYPE.UNISWAP },
            ]}
            optionRenderer={(v) => v.title}
          >
            <div className="flex items-center gap-2 w-full w-20">
              {dexType === SWAP_TYPE.SPACEFI ? "SpaceFi" : "Uniswap"}
            </div>
          </DropdownSelect>
        </div>
        <div className="relative w-full flex flex-col">
          <span className="text-white/25">from</span>
          <div className="rounded-lg p-4 flex w-full flex-col -mb-1 bg-white/[.04] gap-4">
            <div className="flex gap-4">
              <div className="w-full">
                <Input
                  onChange={(e) => setSwapAmount(+e.target.value)}
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
            className="w-10 h-10 p-2 my-5 mx-auto rounded-lg text-white flex items-center justify-center z-10 bg-white/[.04] hover:bg-opacity-40 transition-all "
          >
            <FontAwesomeIcon icon={faArrowsUpDown} className="h-6" />
          </button>
          <span className="text-white/25">to</span>
          <div className="rounded-lg p-4 flex w-full flex-col -mb-1 bg-white/[.04] gap-4">
            <div className="flex gap-4">
              <div className="w-full">
                <Input
                  onChange={(e) => setReceiveAmount(e.target.value)}
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
      {tokenFrom && tokenTo && isSwapModalOpen && poolAddress ? (
        <SwapModal
          pool={poolAddress as string}
          tokenA={tokenFrom}
          tokenB={tokenTo}
          amountA={swapAmount}
          amountB={receiveAmount}
          swapType={dexType}
          onCloseModal={() => setIsSwapModalOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default SwapCard;
