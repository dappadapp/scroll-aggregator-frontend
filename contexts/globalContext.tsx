"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface IGlobalContextProps {
  slippage: number;
  setSlippage: (slippage: number) => void;
}

export const GlobalContext = React.createContext<IGlobalContextProps>({
  setSlippage: (slippage: number) => {},
  slippage: 0.5,
});

export const GlobalContextProvider = (props: any) => {
  const [slippage, setSlippage] = useState(0.5);

  return (
    <GlobalContext.Provider
      value={{
        slippage,
        setSlippage,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
