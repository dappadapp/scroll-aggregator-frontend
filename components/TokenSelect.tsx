import { Fragment, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Listbox, Transition } from "@headlessui/react";
import DropdownSelect from "./DropdownSelect";
import { Network, networks } from "@/utils/networks";

type Props = {
  token: any;
  onChange: (token: any) => void;
};

const TokenSelect = ({ token, onChange }: Props) => {
  const [tokens, setTokens] = useState<Network[]>(networks)

  const handleSearch = (v: string) => {

  }
  
  return (
    <DropdownSelect
      value={token}
      onChange={onChange}
      className="px-4 py-3"
      options={tokens}
      optionRenderer={defaultOptionRenderer}
      onSearch={handleSearch}
    >
      <div className="flex items-center gap-2 w-full max-w-[120px]">
        <Image
          src={`/chains/${token.image}`}
          alt={token.name}
          width={24}
          height={24}
          className="rounded-full w-6 h-6"
        />
        <span className="block truncate text-xs md:text-base font-medium">
          {token.name}
        </span>
      </div>
    </DropdownSelect>
  );
};

const defaultOptionRenderer = (option: any, selected: any) => (
  <div
    className={`flex items-center gap-2 p-1 ${
      selected ? "bg-[#2B2B2B] rounded-lg" : ""
    }`}
  >
    <Image
      src={`/chains/${option.image}`}
      alt={option.name}
      width={24}
      height={24}
      className="rounded-full w-6 h-6"
    />
    <span className="block truncate text-xs md:text-base font-medium">
      {option.name}
    </span>
  </div>
);
export default TokenSelect;
