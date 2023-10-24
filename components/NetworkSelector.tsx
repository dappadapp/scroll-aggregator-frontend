import React, {
  FC,
  ForwardRefRenderFunction,
  Fragment,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
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
    className={`${className} flex items-center gap-2 cursor-pointer`}
    ref={ref}
    onClick={() => (onClick ? onClick(chain) : undefined)}
  >
    <Image
      src={`/chains/${chain.image}`}
      alt={chain.name}
      width={25}
      height={25}
      className="rounded-full w-4 h-4 md:w-6 md:h-6"
    />
    <span className="block truncate text-base text-[#FFF0DD]/90 font-medium">
      {chain.name}
    </span>
  </div>
);

const NetworkItem = forwardRef(NetworkItemRef);

interface NetworkSelectorProps {}

const NetworkSelector: FC<NetworkSelectorProps> = () => {
  const [currentNetwork, setCurrentNetwork] = useState<Network>(networks[0]);
  const { chain } = useNetwork();
  const { switchNetwork, isLoading } = useSwitchNetwork();

  useEffect(() => {
    const newNetwork = networks.find((network) => network.chainId === chain?.id);

    if (newNetwork) setCurrentNetwork(newNetwork);
    else if (switchNetwork) switchNetwork(networks[0].chainId);
  }, [chain, switchNetwork]);

  const handleChangeNetwork = (network: Network) => {
    if (switchNetwork) switchNetwork(network.chainId);
  };

  const handleChangeNetworkChain = (chainId: number) => {
    if (switchNetwork) switchNetwork(chainId);
  };
  return (
    <Menu as="div" className="relative inline-block">
      <div>
        <Menu.Button className="text-white inline-flex cursor-pointer justify-center items-center lg:min-w-[200px] gap-2 p-2 lg:p-3 text-base bg-[#0A0A0A] rounded-lg border border-white/10">
          {chain?.id !== 534352 ? (
            <button onClick={() => handleChangeNetworkChain(534352)}>
              Switch Scroll Mainnet
            </button>
          ) : (
            <Fragment>
              <NetworkItem chain={currentNetwork} />
              {isLoading && <Loading />}
            </Fragment>
          )}
        </Menu.Button>
      </div>
      {chain?.id !== 534352 ? null : (
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Menu.Items className="absolute bg-[#202020] rounded-md right-0 mt-2 w-[200px] origin-top-right z-10 backdrop-blur-xl py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
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
