import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";

import Input from "@/components/Input";
import Button from "@/components/Button";
import TokenSelect from "@/components/TokenSelect";
import useNativeCurrency from "@/hooks/useNativeCurrency";
import { Currency, ERC20Token, Network } from "@/types";
import SwapModal from "./SwapModal";
import { SwapParam } from "./SwapButton";

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
  const [tokenTo, setTokenTo] = useState<Currency>();

  const { data: balanceFrom, isLoading: isLoadingBalanceFrom } = useBalance({
    address: address,
    ...(!tokenFrom?.isNative && {
      token: tokenFrom?.wrapped.address,
    }),
    chainId: tokenFrom?.chainId,
    enabled: !!tokenFrom,    
  })

  const native = useNativeCurrency()

  useEffect(() => {
    setTokenFrom(native.wrapped)
  }, [native])
  
  const handleSwitchToken = () => {

  }

  return (
    <div className="relative h-full">
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
                  onChange={(e) => setSwapAmount(e.target.value)}
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
              {percentageButtons.map((button, index) => (
                <Button className="font-inter text-sm" key={"perc-button-" + index}>
                  {button}%
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
              <Input
                onChange={(e) => setReceiveAmount(e.target.value)}
                value={receiveAmount}
                type="number"
                disabled
                placeholder="Receive Amount"
                className="crosschainswap-input w-full"
              />
              <TokenSelect
                onChange={setTokenTo}
                token={tokenTo}
              />
            </div>
          </div>
        </div>
        
        <Button variant="bordered" disabled={!tokenFrom || !tokenTo || !swapAmount} className="w-full p-4 rounded-lg text-xl font-semibold" onClick={() => isConnected ? setIsSwapModalOpen(true) : open()}>
          {isConnected ? 'SWAP' : 'CONNECT WALLET'}
        </Button>
      </div>
      {tokenFrom && tokenTo && isSwapModalOpen ? (
        <SwapModal
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
