import { Currency, SWAP_TYPE, swapTypeMapping } from "@/types";
import { ethers } from "ethers";
import React, { use, useEffect, useMemo, useState } from "react";

interface DexOffer {
  dex: string;
  amount: string;
}

interface DexOffersProps {
  offers: DexOffer[];
  tokenTo: Currency | undefined;
}

function mapDexType(inputDexType: string): SWAP_TYPE {
  switch (inputDexType) {
    case "space-fi":
      return SWAP_TYPE.SPACEFI;
    case "skydrome":
      return SWAP_TYPE.SKYDROME;
    case "iziswap":
      return SWAP_TYPE.IZUMI;
    case "syncswap":
      return SWAP_TYPE.SYNCSWAP;
    case "punkswap":
      return SWAP_TYPE.PUNKSWAP;
    case "kyberswap":
      return SWAP_TYPE.KYBERSWAP;
    case "coffeswap":
      return SWAP_TYPE.COFFEESWAP;
    case "papyrusswap":
      return SWAP_TYPE.PAPYRUSSWAP;
    default:
      return SWAP_TYPE.INVALID;
  }
}

const DexOffers: React.FC<DexOffersProps> = ({ offers, tokenTo }) => {
  const firstThreeOffers = offers?.slice(0, 3);

  return (
    <div className="flex flex-wrap place-content-center ">
      {firstThreeOffers?.map((offer, index) => (
        <div key={index} className="mx-4 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
              <img
                src={swapTypeMapping[mapDexType(offer?.dex)]?.icon}
                alt={swapTypeMapping[mapDexType(offer?.dex)]?.name}
              />
            </div>
            <p
              className={`text-sm lg:text-lg ${
                index === 0 ? "text-[#3DAFA5]" : "text-[#FFE7DD]"
              }`}
            >
              {swapTypeMapping[mapDexType(offer?.dex)]?.name}
            </p>
          </div>
          <p
            className={`text-xs lg:text-base mt-2 text-center ${
              index === 0 ? "text-[#3DAFA5]" : "text-[#FFE7DD]"
            }`}
          >
            {parseFloat(
              ethers.utils.formatUnits(
                offer.amount,
                tokenTo?.isToken ? tokenTo?.decimals : tokenTo?.wrapped?.decimals
              )
            ).toFixed(6)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DexOffers;
