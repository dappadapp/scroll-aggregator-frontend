"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface IGlobalContextProps {
  slippage: number;
  setSlippage: (slippage: number) => void;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const GlobalContext = React.createContext<IGlobalContextProps>({
  setSlippage: (slippage: number) => {},
  slippage: 0.05,
  refresh: false,
  setRefresh: (refresh: boolean) => {},
});

export const GlobalContextProvider = (props: any) => {
  const [slippage, setSlippage] = useState(0.05);
  const [refresh, setRefresh] = useState(false);
  return (
    <GlobalContext.Provider
      value={{
        slippage,
        setSlippage,
        refresh,
        setRefresh,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
