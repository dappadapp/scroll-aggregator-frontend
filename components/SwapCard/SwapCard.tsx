import type { Network } from "@/utils/networks";
import React, { useEffect, useMemo, useState } from "react";

import { networks } from "@/utils/networks";
import { Input } from "../Input";
import DropdownSelect from "../DropdownSelect";
import { SwapIcon } from "../SwapIcon";
import { Button } from "../Button";
import SwapModal from "../SwapModal";
import { SwapParam } from "./SwapButton";

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
    <div className="relative">
      <div className={`w-full gap-4 h-fit flex-1 flex justify-between flex-col`}>
        <h1 className={"text-3xl w-full"}>Swap</h1>
        <div className="relative w-full flex flex-col items-center">
          <div className="rounded-lg p-4 flex w-full flex-col -mb-1 bg-white gap-2 pb-7 bg-opacity-[4%]">
            <span className="text-[#AAA]">swap from</span>
            <div className="flex gap-2 flex-col md:flex-row">
              <Input
                onChange={(e) => setSwapFromInput(e.target.value)}
                value={swapFromInput}
                type="number"
                placeholder="Send Amount"
                className="md:!w-[50%] crosschainswap-input"
              />
              <div className="flex flex-col md:flex-row w-full md:w-[50%] md:justify-end gap-5">
                <DropdownSelect
                  onChange={(e: any) => setSelectedFromToken(e)}
                  value={selectedFromToken}
                  options={networks}
                />
                <DropdownSelect
                  onChange={(e: any) => setSelectedFromChain(e)}
                  value={selectedFromChain}
                  options={networks}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {percentageButtons.map((button, index) => (
                <Button className="text-sm" key={"perc-button-" + index}>
                  {button}%
                </Button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onArrowClick()}
            className=" w-10 h-10 p-2 -mb-1 rounded-lg text-white flex items-center justify-center z-10 -mt-1 bg-[#1B1B35] hover:bg-opacity-40 transition-all "
          >
            <SwapIcon />
          </button>
          <div className="rounded-lg w-full -mt-1 p-4 flex flex-col bg-white gap-2 pb-7 bg-opacity-[4%]">
            <span className="text-[#AAA]">receive</span>
            <div className="flex gap-2 flex-col md:flex-row">
              <Input
                onChange={(e) => setSwapFromInput(e.target.value)}
                value={swapFromInput}
                type="number"
                disabled
                placeholder="Receive Amount"
                className="md:!w-[50%] crosschainswap-input w-full"
              />
              <div className="flex w-full flex-col md:flex-row md:w-[50%] md:justify-end gap-5">
                <DropdownSelect
                  onChange={(e: any) => setSelectedToToken(e)}
                  value={selectedToToken}
                  options={networks}
                />
                <DropdownSelect
                  onChange={(e: any) => setSelectedToChain(e)}
                  value={selectedToChain}
                  options={networks}
                />
              </div>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsSwapModalOpen(true)}>SWAP</Button>
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
