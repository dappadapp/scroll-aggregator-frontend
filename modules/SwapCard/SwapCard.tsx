import type { Network } from "@/utils/networks";
import React, { useEffect, useMemo, useState } from "react";

import { networks } from "@/utils/networks";
import { Input } from "../../components/Input";
import DropdownSelect from "../../components/DropdownSelect";
import { Button } from "../../components/Button";
import SwapModal from "../../components/SwapModal";
import { SwapParam } from "./SwapButton";
import IconSlider from '@/assets/images/icon-sliders.svg'
import IconRefresh from '@/assets/images/icon-refresh.svg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import TokenSelect from "@/components/TokenSelect";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  onChangeSourceChain: (selectedNetwork: Network) => Promise<void>;
  onChangeTargetChain: (selectedNetwork: Network) => Promise<void>;
  onArrowClick: () => Promise<void>;
};

const percentageButtons = [25, 50, 75, 100];

const SwapCard: React.FC<Props> = ({ sourceChain, targetChain, onArrowClick }) => {
  const [swapFromInput, setSwapFromInput] = useState(0);
  const [receiveInput, setReceiveInput] = useState(0);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedFromChain, setSelectedFromChain] = useState<Network>(sourceChain);
  const [selectedToChain, setSelectedToChain] = useState<Network>(targetChain);
  //TODO: Add tokens
  const [selectedToToken, setSelectedToToken] = useState<Network>(networks[0]);
  const [selectedFromToken, setSelectedFromToken] = useState<Network>(networks[0]);

  const swapParams: SwapParam[] = useMemo(
    () => setSwapParams(selectedToToken, selectedFromToken, swapFromInput, receiveInput),
    [selectedToToken, selectedFromToken, swapFromInput, receiveInput]
  );
  //TODO: Add approve function for tokenOut

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
              <Input
                onChange={(e) => setSwapFromInput(e.target.value)}
                value={swapFromInput}
                type="number"
                placeholder="Enter Amount"
                className="w-full crosschainswap-input"
              />
              <TokenSelect
                onChange={setSelectedFromToken}
                token={selectedFromToken}
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
            onClick={onArrowClick}
            className="w-10 h-10 p-2 my-5 mx-auto rounded-lg text-white flex items-center justify-center z-10 bg-[#1B1B35] hover:bg-opacity-40 transition-all "
          >
            <FontAwesomeIcon icon={faArrowsUpDown} className="h-6" />
          </button>
          <span className="text-white/25">to</span>
          <div className="rounded-lg p-4 flex w-full flex-col -mb-1 bg-white/[.04] gap-4">
            <div className="flex gap-4">
              <Input
                onChange={(e) => setReceiveInput(e.target.value)}
                value={receiveInput}
                type="number"
                disabled
                placeholder="Receive Amount"
                className="crosschainswap-input w-full"
              />
              <TokenSelect
                onChange={setSelectedToToken}
                token={selectedToToken}
              />
            </div>
          </div>
        </div>
        <Button variant="bordered" className="w-full p-4 rounded-lg text-xl font-semibold" onClick={() => setIsSwapModalOpen(true)}>
          SWAP
        </Button>
      </div>
      {isSwapModalOpen ? (
        <SwapModal
          liqSource="WOOFI"
          rate="1 ETH = 1000 USDC"
          minRecieve={1000.1}
          tradingFee="0 ETH (0$)"
          slippage={20}
          swapParams={swapParams}
          onCloseModal={() => setIsSwapModalOpen(false)}
        />
      ) : null}
    </div>
  );
};
const setSwapParams = (
  selectedToToken: Network,
  selectedFromToken: Network,
  swapFromInput: number,
  receiveInput: number
): SwapParam[] => {
  let swapParamsArr: SwapParam[] = [];
  //TODO: Validate params
  let swapParam: SwapParam = {
    tokenOut: selectedFromToken.wrappedNativeAddress,
    tokenIn: selectedToToken.wrappedNativeAddress,
    amountOutMin: swapFromInput,
    amountIn: receiveInput,
    fee: 0,
    poolAddress: "",
    swapType: 3,
  };
  swapParamsArr.push(swapParam);
  return swapParamsArr;
};
export default SwapCard;
