import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useContractRead, useNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { formatUnits, parseUnits } from "viem";
import _ from "lodash";

import Input from "@/components/Input";
import Button from "@/components/Button";
import TokenSelect from "@/components/TokenSelect";
import useNativeCurrency from "@/hooks/useNativeCurrency";
import Tokens from "@/constants/tokens";
import addresses from "@/constants/contracts";
import { ChainId, Currency } from "@/types";
import SwapModal from "./SwapModal";

import SyncSwapPoolFactoryAbi from "@/constants/abis/basePoolFactory.json"
import SyncSwapClassicPool from "@/constants/abis/SyncSwapClassicPool.json"
import SyncSwapStablePool from "@/constants/abis/SyncSwapStablePool.json"
import IconSlider from '@/assets/images/icon-sliders.svg'
import IconRefresh from '@/assets/images/icon-refresh.svg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";

type Props = {
};

const percentageButtons = [25, 50, 75, 100];

const SwapCard: React.FC<Props> = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();  
  const [swapAmount, setSwapAmount] = useState(0);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  //TODO: Add tokens
  const [tokenFrom, setTokenFrom] = useState<Currency>();
  const [tokenTo, setTokenTo] = useState<Currency | undefined>(Tokens[ChainId.SCROLL_TESTNET].mock);
  const [isChangeFrom, setChangeFrom] = useState(true);

  const { data: balanceFrom, isLoading: isLoadingBalanceFrom } = useBalance({
    address: address,
    ...(!tokenFrom?.isNative && {
      token: tokenFrom?.wrapped.address,
    }),
    chainId: tokenFrom?.chainId,
    enabled: !!tokenFrom,    
  })

  const { data: balanceTo, isLoading: isLoadingBalanceTo } = useBalance({
    address: address,
    ...(!tokenTo?.isNative && {
      token: tokenTo?.wrapped.address,
    }),
    chainId: tokenTo?.chainId,
    enabled: !!tokenTo,    
  })

  const { data: poolAddress } = useContractRead({
    address: addresses.syncswapClassicPoolFactory,
    abi: SyncSwapPoolFactoryAbi,
    functionName: "getPool",
    args: [tokenFrom?.wrapped.address, tokenTo?.wrapped.address],
    enabled: !!tokenFrom && !!tokenTo
  });

  const { data: outAmount } = useContractRead({
    address: poolAddress as `0x${string}`,
    abi: SyncSwapClassicPool,
    functionName: "getAmountOut",
    args: [tokenFrom?.wrapped.address, parseUnits(`${swapAmount.toFixed(10)}`, tokenFrom?.decimals || 18), address],
    enabled: !!poolAddress && !!tokenFrom && isChangeFrom
  });

  const { data: inAmount } = useContractRead({
    address: poolAddress as `0x${string}`,
    abi: SyncSwapClassicPool,
    functionName: "getAmountIn",
    args: [tokenTo?.wrapped.address, parseUnits(`${receiveAmount.toFixed(10)}`, tokenTo?.decimals || 18), address],
    enabled: !!poolAddress && !!tokenTo && !isChangeFrom
  });


  useEffect(() => {
    if( outAmount !== undefined && tokenTo && isChangeFrom ) {
      setReceiveAmount(+(+formatUnits(outAmount as bigint, tokenTo.decimals)).toFixed(10))
    }
  }, [outAmount, tokenTo, isChangeFrom])

  useEffect(() => {
    if( inAmount !== undefined && tokenFrom && !isChangeFrom  ) {
      setSwapAmount(+formatUnits(inAmount as bigint, tokenFrom.decimals))
    }
  }, [inAmount, tokenFrom, !isChangeFrom])

  const native = useNativeCurrency()

  useEffect(() => {
    setTokenFrom(native.wrapped)
  }, [native])
  
  const handleSwitchToken = () => {
    setTokenFrom(tokenTo);
    setTokenTo(tokenFrom);
  }

  const handleClickInputPercent = (percent: number) => {
    if( !balanceFrom || !tokenFrom ) 
      return;
    const balance = formatUnits(balanceFrom.value, tokenFrom?.decimals) 
    setSwapAmount(parseInt(balance) * percent / 100);
    setChangeFrom(true);
  }

  const onKeyDownSwapAmount = () => {
    setChangeFrom(true);
  }

  const onKeyDownReceiveAmount = () => {
    setChangeFrom(false);
  }

  return (
    <div className="w-full max-w-[548px] relative p-8 gap-2 flex flex-col relative border-r border-white/10 bg-white/5 rounded-l-2xl mx-auto my-4">
      <div className={`w-full h-full gap-4 flex-1 flex justify-between flex-col`}>
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-3xl">SWAP</h1>
          <Button className="p-3 w-12 h-12 rounded-lg ms-auto">
            <IconSlider />
          </Button>
          <Button className="p-3 w-12 h-12 rounded-lg">
            <IconRefresh />
          </Button>
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
                {balanceFrom &&
                  <div className="mt-2">
                    Balance: {balanceFrom.formatted} {balanceFrom.symbol}
                  </div>
                }
              </div>
              <TokenSelect
                onChange={setTokenFrom}
                token={tokenFrom}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {percentageButtons.map((val, index) => (
                <Button className="font-inter text-sm" key={"perc-button-" + index} onClick={() => handleClickInputPercent(val)}>
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
                  onChange={(e) => setReceiveAmount(+e.target.value)}
                  onKeyDown={onKeyDownReceiveAmount}
                  value={receiveAmount}
                  type="number"
                  placeholder="Receive Amount"
                  className="crosschainswap-input w-full"
                />
                {balanceTo &&
                  <div className="mt-2">
                    Balance: {balanceTo.formatted} {balanceTo.symbol}
                  </div>
                }
              </div>
              <TokenSelect
                onChange={setTokenTo}
                token={tokenTo}
              />
            </div>
          </div>
        </div>
        
        <Button variant="bordered" disabled={isConnected && (!tokenFrom || !tokenTo || !swapAmount)} className="w-full p-4 rounded-lg text-xl font-semibold" onClick={() => isConnected ? setIsSwapModalOpen(true) : open()}>
          {isConnected ? 'SWAP' : 'CONNECT WALLET'}
        </Button>
      </div>
      {tokenFrom && tokenTo && isSwapModalOpen && poolAddress ? (
        <SwapModal
          pool={poolAddress as string}
          tokenA={tokenFrom}
          tokenB={tokenTo}
          amountA={swapAmount}
          amountB={receiveAmount}
          onCloseModal={() => setIsSwapModalOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default SwapCard;
