import React, { FC, Fragment, useState } from "react";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { Network, networks } from "@/utils/networks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

interface NetworkItemProps {
  chain: Network;
  className?: string;
  onClick?: (chain: Network) => void;
}

const NetworkItem : FC<NetworkItemProps> = ({
  chain,
  className = "",
  onClick,
}) => (
  <div
    className={`${className} flex items-center gap-2 cursor-pointer`}
    onClick={() => (onClick ? onClick(chain) : undefined)}
  >
    <Image
      src={`/chains/${chain.image}`}
      alt={chain.name}
      width={25}
      height={25}
      className="rounded-full w-4 h-4 md:w-6 md:h-6"
    />
    <span className="block truncate text-xs md:text-base font-medium">
      {chain.name}
    </span>
  </div>
);

const NetworkSelector = () => {
  const [chain, setChain] = useState<Network>(networks[0]);

  return (
    <Menu as="div" className="relative inline-block">
      <div>
        <Menu.Button className="inline-flex justify-center items-center min-w-[200px] gap-2 p-3 bg-[#0A0A0A] rounded-lg border border-white/10">
          <NetworkItem chain={chain} />
          <span className="pointer-events-none inset-y-0 flex items-center">
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Menu.Items className="absolute bg-[#202020] rounded-md right-0 mt-2 w-[320px] origin-top-right z-10 backdrop-blur-xl py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
          {networks.map((network) => (
            <Menu.Item as={Fragment}>
              {({ active }) => (
                <NetworkItem
                  key={network.chainId}
                  chain={network}
                  className="group text-[#CACACA] select-none p-3 hover:bg-[#2B2B2B]"
                  onClick={setChain}
                />
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NetworkSelector;
