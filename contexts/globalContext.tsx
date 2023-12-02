"use client";
import { Currency } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface IGlobalContextProps {
  slippage: number;
  setSlippage: (slippage: number) => void;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
  childlist: any[] | undefined;
  setChildlist: (childlist: any[] | undefined) => void;
  tokens: Currency[] | undefined;
  setTokens: (tokens: Currency[] | undefined) => void;
}

export const GlobalContext = React.createContext<IGlobalContextProps>({
  slippage: 0.5,
  setSlippage: (slippage: number) => {},
  refresh: false,
  setRefresh: (refresh: boolean) => {},
  childlist: undefined,
  setChildlist: (childlist: any[] | undefined) => {},
  tokens: undefined,
  setTokens: (tokens: Currency[] | undefined) => {}
});

export const GlobalContextProvider = (props: any) => {
  const [slippage, setSlippage] = useState(0.5);
  const [refresh, setRefresh] = useState(false);
  const [tokens, setTokens] = useState<Currency[] | undefined>(undefined);
  const [childlist, setChildlist] = useState<any[] | undefined>(undefined);
  return (
    <GlobalContext.Provider
      value={{
        slippage,
        setSlippage,
        refresh,
        setRefresh,
        tokens,
        setTokens,
        childlist,
        setChildlist
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
