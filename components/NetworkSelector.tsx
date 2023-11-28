import React, {
  FC,
  ForwardRefRenderFunction,
  Fragment,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { networks } from "@/constants/networks";
import { Network } from "@/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/assets/images/loading.svg";
import Button from "./Button";

interface NetworkItemProps {
  chain: Network;
  className?: string;
  onClick?: (chain: Network) => void;
}

const NetworkItemRef: ForwardRefRenderFunction<HTMLDivElement, NetworkItemProps> = (
  { chain, className = "", onClick },
  ref
) => (
  <div
    className={`${className} flex flex-row justify-center items-center xs:gap-3 gap-2 cursor-pointer`}
    ref={ref}
    onClick={() => (onClick ? onClick(chain) : undefined)}
  >
    <Image
      src={`/chains/${chain.image}`}
      alt={chain.name}
      width={25}
      height={25}
      className="md:w-5 md:h-5 w-4 h-4"
    />
    <span className="block text-[#FFF0DD]/90 font-medium mt-1 xl:text-base xs:text-sm text-xs">
      <span className="hidden xs:flex truncate">
        {chain.name + (chain.isTestnet ? " Testnet" : " Mainnet")}
      </span>
      <span className="flex xs:hidden">
        {chain.name}
      </span>
    </span>
  </div>
);

const NetworkItem = forwardRef(NetworkItemRef);

interface NetworkSelectorProps {}

const NetworkSelector: FC<NetworkSelectorProps> = () => {
  const [currentNetwork, setCurrentNetwork] = useState<Network>(networks[0]);
  const { chain } = useNetwork();
  const { switchNetwork, isLoading } = useSwitchNetwork();
  const { isConnected } = useAccount();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected])

  // useEffect(() => {
  //   const newNetwork = networks.find((network) => network.chainId === chain?.id);

  //   if (newNetwork) setCurrentNetwork(newNetwork);
  //   else if (switchNetwork) switchNetwork(networks[0].chainId);
  // }, [chain, switchNetwork]);

  const handleChangeNetwork = (network: Network) => {
    if (switchNetwork) switchNetwork(network.chainId);
  };

  const handleChangeNetworkChain = (chainId: number) => {
    if (switchNetwork) switchNetwork(chainId);
  };

  return (
    <Menu as="div" className="relative inline-block">
      {!isWalletConnected ? 
        <span className="select-none md:whitespace-normal whitespace-nowrap text-white opacity-50 flex flex-row justify-center items-center duration-150 transition gap-2 px-6 py-3 md:min-w-[10rem] md:w-auto xs:w-[9.25rem] w-[8.25rem] xl:max-h-[3rem] md:max-h-[2.75rem] xs:max-h-[2.5rem] max-h-[2rem] xl:text-base text-sm bg-[#0A0A0A] rounded-lg border border-white/10">
          Switch Network
        </span>
      : 
        <div className="text-white flex flex-row justify-center items-center cursor-pointer duration-150 transition gap-2 px-6 py-3 md:min-w-[10rem] md:w-auto xs:w-[9.25rem] w-[8.25rem] xl:max-h-[3rem] md:max-h-[2.75rem] xs:max-h-[2.5rem] max-h-[2rem] xl:text-base text-sm bg-[#0A0A0A] rounded-lg border border-white/10 hover:bg-[#151515]">
          {chain?.id !== 534352 ? (
            <button onClick={() => handleChangeNetworkChain(534352)} className="select-none md:whitespace-normal whitespace-nowrap">
              {isLoading ? 
                <div className="flex justify-center items-center xl:w-[1.75rem] w-[1.5rem]">
                  <Loading />
                </div>
              : 
               "Switch Network"
              }
            </button>
          ) : (
            <Fragment>
              <NetworkItem chain={currentNetwork} className="select-none" />
            </Fragment>
          )}
        </div>
      } 
      {chain?.id !== 534352 && (
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Menu.Items className="absolute bg-[#202020] rounded-md right-0 mt-2 w-[200px] origin-top-right backdrop-blur-xl py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
            {networks.map((network) => (
              <Menu.Item as={Fragment} key={network.chainId}>
                {({ active }) => (
                  <NetworkItem
                    key={network.chainId}
                    chain={network}
                    className="group text-[#CACACA] select-none p-3 hover:bg-[#2B2B2B]"
                    onClick={handleChangeNetwork}
                  />
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      )}
    </Menu>
  );
};

export default NetworkSelector;
