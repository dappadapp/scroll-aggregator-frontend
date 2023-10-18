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
  slippage: 20,
});

export const GlobalContextProvider = (props: any) => {
  const [slippage, setSlippage] = useState(20);

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
