import { useState, useEffect, ReactElement } from "react";
import { BigNumber, ethers } from "ethers";
import { ClipLoader } from "react-spinners";
import Select from "react-select";

import ReCaptcha from "./ReCaptcha";
import queryString from "query-string";
import axios, { AxiosResponse } from "axios";
import { useAccount } from "wagmi";
import Button from "@/components/Button";
import Input from "@/components/Input";

type DropdownOption = {
  label: ReactElement<any, any>;
  value: number;
  search: string;
};
const FaucetCard = (props: any) => {
  const [chain, setChain] = useState<number | null>(null);
  const [token, setToken] = useState<number | null>(null);
  const [widgetID, setwidgetID] = useState(new Map());
  const [recaptcha, setRecaptcha] = useState<ReCaptcha | undefined>(undefined);
  const [isV2, setIsV2] = useState<boolean>(false);
  const [chainConfigs, setChainConfigs] = useState<any>([]);
  const [inputAddress, setInputAddress] = useState<string>("");
  const [address, setAddress] = useState<string | null>(null);
  const [faucetAddress, setFaucetAddress] = useState<string | null>(null);
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [tokenOptions, setTokenOptions] = useState<DropdownOption[]>([]);
  const [balance, setBalance] = useState<string>("0");
  const [shouldAllowSend, setShouldAllowSend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingBalance, setIsFetchingBalance] = useState<AbortController | null>(
    null
  );
  const [sendTokenResponse, setSendTokenResponse] = useState<any>({
    txHash: null,
    message: null,
  });
  const { address: account } = useAccount();
  useEffect(() => {
    if (!account) return;
    setInputAddress(account);
  }, [account]);

  // Update chain configs
  useEffect(() => {
    setRecaptcha(
      new ReCaptcha(
        props.config.SITE_KEY,
        props.config.ACTION,
        props.config.V2_SITE_KEY,
        setwidgetID
      )
    );
    updateChainConfigs();
  }, []);

  // Update balance whenver chain changes or after transaction is processed
  useEffect(() => {
    updateBalance();
  }, [chain, token, sendTokenResponse, chainConfigs]);

  // Make REQUEST button disabled if either address is not valid or balance is low
  useEffect(() => {
    if (address) {
      setShouldAllowSend(true);
      return;
    }

    setShouldAllowSend(false);
  }, [address, balance]);

  useEffect(() => {
    updateFaucetAddress();
  }, [chain, chainConfigs]);

  useEffect(() => {
    let newOptions: DropdownOption[] = [];

    chainConfigs?.forEach((chain: any, i: number) => {
      let item = (
        <div className="select-dropdown">
          <img alt={chain.NAME[0]} src={chain.IMAGE} />
          {chain.NAME}

          {chain.CONTRACTADDRESS && (
            <span
              style={{ color: "rgb(180, 180, 183)", marginLeft: "5px" }}
            >
              {chainConfigs[chainToIndex(chain.HOSTID) || 0]?.NAME}
            </span>
          )}
        </div>
      );

      if (!chain.CONTRACTADDRESS) {
        newOptions.push({
          label: item,
          value: i,
          search: chain.NAME,
        });
      }
    });

    setOptions(newOptions);
    setChain(newOptions[0]?.value);
  }, [chainConfigs]);

  useEffect(() => {
    let newOptions: DropdownOption[] = [];

    chainConfigs?.forEach((chain: any, i: number) => {
      const { chain: ch } = getChainParams();

      let item = (
        <div className="select-dropdown">
          <img alt={chain.NAME[0]} src={chain.CONTRACTADDRESS === "0x5300000000000000000000000000000000000004" ? "./eth.png" : (chain.CONTRACTADDRESS === "0x87225C02F104a353d7dA0708907Ec18d1e74ce27" ? "./mock.png" : chain.CONTRACTADDRESS === "0x85BB8651cb707150660c4658B7A11a8cdA5B4Fe3" ? "./tether.png" : "./eth.png" ) } />
          {chain.ID == ch ? chain.TOKEN : chain.NAME}

          <span
            style={{ color: "rgb(180, 180, 183)", marginLeft: "5px" }}
          >
            {chain.CONTRACTADDRESS ? "ERC20" : "Native"}
          </span>
        </div>
      );

      if ((chain.CONTRACTADDRESS && chain.HOSTID == ch) || chain.ID == ch) {
        newOptions.push({
          label: item,
          value: i,
          search: chain.NAME,
        });
      }
    });

    setTokenOptions(newOptions);
    setToken(newOptions[0]?.value);
  }, [chainConfigs, chain]);

  const getConfigByTokenAndNetwork = (token: any, network: any): number => {
    let selectedConfig = 0;

    try {
      token = token?.toUpperCase();
      network = network?.toUpperCase();

      chainConfigs.forEach((chain: any, i: number): any => {
        if (chain.TOKEN == token && chain.HOSTID == network) {
          selectedConfig = i;
        }
      });
    } catch (err: any) {
      console.log(err);
    }

    return selectedConfig;
  };

  let totalTokens: boolean = tokenOptions?.length === 0;

  useEffect(() => {
    const query = queryString.parse(window.location.search);

    const { address, subnet, erc20 } = query;

    const tokenIndex: number = getConfigByTokenAndNetwork(erc20, subnet);

    if (typeof address == "string") {
      updateAddress(address);
    }

    if (typeof subnet == "string") {
      setChain(chainToIndex(subnet));
      if (typeof erc20 == "string") {
        setToken(tokenIndex);
      }
    } else {
      setChain(0);
    }
  }, [options, totalTokens]);

  // API calls
  async function updateChainConfigs(): Promise<void> {
    const response: AxiosResponse = await axios.get("/api/faucet/chain-configs");
    setChainConfigs(response?.data?.configs);
  }

  function getChainParams(): { chain: string; erc20: string } {
    let params = {
      chain: chainConfigs[chain!]?.ID,
      erc20: chainConfigs[token!]?.ID,
    };

    return params;
  }

  async function updateBalance(): Promise<void> {
    // Abort pending requests
    const controller = new AbortController();
    if (isFetchingBalance) {
      isFetchingBalance.abort();
    }
    setIsFetchingBalance(controller);

    if ((chain || chain == 0) && chainConfigs.length > 0) {
      let { chain, erc20 } = getChainParams();

      // const response: AxiosResponse = await axios.get("/api/faucet/balance", {
      //   params: {
      //     chain,
      //     erc20,
      //   },
      //   signal: controller.signal,
      // });

      // if (response?.data?.balance || response?.data?.balance == 0) {
      //   setBalance(response?.data?.balance);
      // }
    }
  }

  async function updateFaucetAddress(): Promise<void> {
    if ((chain || chain == 0) && chainConfigs.length > 0) {
      let { chain } = getChainParams();

      const response: AxiosResponse = await axios.get("/api/faucet/address", {
        params: {
          chain,
        },
      });

      if (response?.data) {
        setFaucetAddress(response?.data?.address);
      }
    }
  }

  function calculateBaseUnit(amount: string = "0", decimals: number): BigInt {
    const amo = ethers.utils.parseUnits(amount.toString(), decimals);

    const myBigInt = BigInt(amo.toString());

    return myBigInt;
  }

  function calculateLargestUnit(amount: string = "0", decimals: number = 18): string {
    let base = "1";
    for (let i = 0; i < decimals; i++) {
      base += "0";
    }
    return (BigInt(amount) / BigInt(base)).toString();
  }

  function chainToIndex(id: any): number | null {
    if (chainConfigs?.length > 0) {
      if (typeof id == "string") {
        id = id.toUpperCase();
      }
      let index: number = 0;
      chainConfigs.forEach((chain: any, i: number) => {
        if (id == chain.ID) {
          index = i;
        }
      });
      return index;
    } else {
      return null;
    }
  }
  useEffect(() => {
    if (!account) return;
    updateAddress(account);
  }, [account]);

  function updateAddress(addr: any): void {
    setInputAddress(addr!);

    if (addr) {
      if (ethers.utils.isAddress(addr)) {
        setAddress(addr);
      } else {
        setAddress(null);
      }
    } else if (address != null) {
      setAddress(null);
    }
  }

  async function getCaptchaToken(
    index: number = 0
  ): Promise<{ token?: string; v2Token?: string }> {
    const { token, v2Token } = await recaptcha!.getToken(isV2, widgetID, index);
    return { token, v2Token };
  }

  function updateChain(option: any): void {
    let chainNum: number = option.value;

    if (chainNum >= 0 && chainNum < chainConfigs.length) {
      setChain(chainNum);
      back();
    }
  }

  function updateToken(option: any): void {
    let tokenNum: number = option.value;

    if (tokenNum >= 0 && tokenNum < chainConfigs.length) {
      setToken(tokenNum);
      back();
    }
  }

  const ifCaptchaFailed = (data: any, index: number = 0, reload: boolean = false) => {
    if (typeof data?.message == "string") {
      if (data.message.includes("Captcha verification failed")) {
        setIsV2(true);
        recaptcha?.loadV2Captcha(props.config.V2_SITE_KEY, widgetID, index, reload);
      }
    }
  };

  async function sendToken(): Promise<void> {
    let data: any;
    try {
      setIsLoading(true);

      const { token, v2Token } = await getCaptchaToken();

      let { chain, erc20 } = getChainParams();
      console.log(address);
      const response = await axios.post("/api/faucet", {
        address,
        token,
        v2Token,
        chain,
        erc20,
      });
      data = response?.data;
    } catch (err: any) {
      console.log("err",err);
      data = err?.response?.data || err;
    }

    //ifCaptchaFailed(data);

    setSendTokenResponse({
      txHash: data?.txHash,
      message: data?.message,
    });

    setIsLoading(false);
  }

  const getOptionByValue = (value: any): DropdownOption => {
    let selectedOption: DropdownOption = options[0];
    options.forEach((option: DropdownOption): void => {
      if (option.value == value) {
        selectedOption = option;
      }
    });
    return selectedOption;
  };

  const getTokenOptionByValue = (value: any): DropdownOption => {
    let selectedOption: DropdownOption = tokenOptions[0];
    tokenOptions.forEach((option: DropdownOption): void => {
      if (option.value == value) {
        selectedOption = option;
      }
    });
    return selectedOption;
  };

  const customStyles = {
    control: (base: any, state: { isFocused: any }) => ({
      ...base,
      background: "rgba(255,255,255,0.04)",
      borderRadius: state.isFocused ? "5px 5px 0 0" : 5,
      border: "none",
     
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      background: "rgba(17,24,39,0.9);",
      color: "white",
      backdropFilter: "blur(12px)",
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
      "::-webkit-scrollbar": {
        width: "2px",
      },
      "::-webkit-scrollbar-track": {
        background: "black",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#888",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
    }),
    option: (styles: any, { isFocused, isSelected }: any) => ({
      ...styles,
      background: isFocused ? "rgb(55 65 81)" : isSelected ? "rgb(55 65 81)" : undefined,
      color: isFocused || isSelected ? "rgb(59 130 246)" : undefined,
      zIndex: 1,
    }),
    input: (base: any) => ({
      ...base,
      color: "white",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "white",
    }),
  };

  const ChainDropdown = () => (
    <div style={{ width: "100%", marginTop: "5px" }}>
      <Select
        options={options}
        value={getOptionByValue(chain)}
        onChange={updateChain}
        styles={customStyles}
        getOptionValue={(option: any) => option.search}
      />
    </div>
  );

  const TokenDropdown = () => (
    <div style={{ width: "100%" }}>
      <Select
        options={tokenOptions}
        value={getTokenOptionByValue(token)}
        onChange={updateToken}
        styles={customStyles}
        getOptionValue={(option: any) => option.search}
      />
    </div>
  );

  const resetRecaptcha = (): void => {
    setIsV2(false);
    recaptcha!.resetV2Captcha(widgetID);
  };

  const back = (): void => {
    //resetRecaptcha()
    setSendTokenResponse({
      txHash: null,
      message: null,
    });
  };

  const toString = (mins: number): string => {
    if (mins < 60) {
      return `${mins} minute${mins > 1 ? "s" : ""}`;
    } else {
      const hour = ~~(mins / 60);
      const minute = mins % 60;

      if (minute == 0) {
        return `${hour} hour${hour > 1 ? "s" : ""}`;
      } else {
        return `${hour} hour${hour > 1 ? "s" : ""} and ${minute} minute${
          minute > 1 ? "s" : ""
        }`;
      }
    }
  };

  return (
    <div className="w-full max-w-[548px] p-8 gap-2 flex shadow-sm shadow-[#FFE7DD] flex-col relative border-r border-white/10 bg-white/[.01] rounded-xl mx-auto my-4">
       <h1 className="text-white font-semibold text-xl lg:text-3xl ml-4 mb-4 mt-4">FAUCET</h1>
      <div className="p-4">
     
        <div className="w-full">
       
          <span className="flex justify-between">
            <span className="text-white mb-2">Select Network</span>
          </span>
          <ChainDropdown /> <br />
          <div>
            <div style={{ width: "100%" }}>
              {/* <span style={{ color: "grey", fontSize: "12px", float: "right" }}>
                  Faucet balance:{" "}
                  {calculateLargestUnit(balance, chainConfigs[token!]?.DECIMALS)}{" "}
                  {chainConfigs[token!]?.TOKEN}
                </span> */}

              <span className="flex justify-between">
                <span className="text-white mb-2">Select Token</span>
              </span>

              <TokenDropdown />
            </div>
          </div>
        </div>

        <br />

        <div style={{ display: sendTokenResponse?.txHash ? "none" : "block" }}>
          <p className="text-[grey] text-[13px]  tracking-[1px] leading-5">
            Drops are limited to
            <span className="font-medium ml-0.5">
              {chainConfigs[token!]?.RATELIMIT?.MAX_LIMIT} request in{" "}
              {toString(chainConfigs[token!]?.RATELIMIT?.WINDOW_SIZE)}.
            </span>
          </p>

          <Input
            placeholder="Hexadecimal Address (0x...)"
            value={inputAddress || ""}
            onChange={(e) => updateAddress(e.target.value)}
          />
          <span className="rate-limit-text" style={{ color: "red" }}>
            {sendTokenResponse?.message}
          </span>

          <div className="v2-recaptcha" style={{ marginTop: "10px" }}></div>

          <div className="text-[#ff5252] text-sm text-center rounded mt-5">
            <p>This is a testnet faucet. Funds are not real.</p>
          </div>

          <Button onClick={sendToken} className={`w-full  mt-3`}>
            {isLoading ? (
              <ClipLoader size="20px" speedMultiplier={0.3} color="403F40" />
            ) : (
              <span>
                Request {chainConfigs[token || 0]?.DRIP_AMOUNT}{" "}
                {chainConfigs[token || 0]?.TOKEN}
              </span>
            )}
          </Button>
        </div>

        <div style={{ display: sendTokenResponse?.txHash ? "block" : "none" }}>
          <p className="text-[grey] text-[13px]  tracking-[1px] leading-5">
            {sendTokenResponse?.message}
          </p>

          <div>
            <span className="text-sm  text-[rgba(255, 255, 255, 0.536)]">
              Transaction ID
            </span>
            <p className="text-[grey] text-[13px]  tracking-[1px] leading-5 break-all">
              <a
                target={"_blank"}
                href={"https://sepolia.scrollscan.dev/tx/" + sendTokenResponse?.txHash}
                rel="noreferrer"
              >
                {sendTokenResponse?.txHash}
              </a>
            </p>
          </div>

          <button
            className="text-[white] h-9 w-[100px] rounded bg-[rgba(255,255,255,0.15)] cursor-pointer uppercase mt-2.5 px-4 py-0 border-0 hover:bg-[#333]"
            onClick={back}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaucetCard;
