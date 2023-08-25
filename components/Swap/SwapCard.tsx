import type { Network } from "@/utils/networks";
import React, { useEffect, useMemo, useState } from "react";

import { networks } from "@/utils/networks";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import swapIcon from "@/assets/images/swapIcon.svg";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { Input } from "../Input";
import DropdownSelect from "../DropdownSelect";
import { SwapIcon } from "../SwapIcon";
import { Button } from "../Button";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  onChangeSourceChain: (selectedNetwork: Network) => Promise<void>;
  onChangeTargetChain: (selectedNetwork: Network) => Promise<void>;
  onArrowClick: () => Promise<void>;
  onSwap: React.Dispatch<React.SetStateAction<boolean>>;
};

const percentageButtons = [25, 50, 75, 100];

const SwapCard: React.FC<Props> = ({ sourceChain }) => {
  const [swapFromInput, setSwapFromInput] = useState(0);
  const [receiveInput, setReceiveInput] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputTokenId, setInputTokenId] = useState("");
  const [selectedFromChain, setSelectedFromChain] = useState<any>(networks[0]);
  const [selectedFromToken, setSelectedFromToken] = useState<any>(networks[0]);
  const [selectedToChain, setSelectedToChain] = useState<any>(networks[0]);
  const [selectedToToken, setSelectedToToken] = useState<any>(networks[0]);

  return (
    <div
      className={`w-full p-10 border-r border-white/10 min-h-[560px] gap-2 h-fit flex-1 flex justify-between flex-col`}
    >
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
              className="w-full crosschainswap-input"
            />
            <DropdownSelect
              onChange={(e: any) => setSelectedFromToken(e)}
              value={selectedFromToken}
              options={networks}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {percentageButtons.map((button, index) => (
              <Button className="text-sm" key={"perc-button-" + index}>
                {button}%
              </Button>
            ))}
          </div>
        </div>
        <button className=" w-10 h-10 p-2 -mb-1 rounded-lg text-white flex items-center justify-center z-10 -mt-1 bg-[#1B1B35] hover:bg-opacity-40 transition-all ">
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
              className="crosschainswap-input w-full"
            />

            <DropdownSelect
              onChange={(e: any) => selectedToToken(e)}
              value={selectedToToken}
              options={networks}
            />
          </div>
        </div>
      </div>
      <Button>SWAP</Button>
    </div>
  );
};

export default SwapCard;
