import { Fragment, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Listbox, Transition } from "@headlessui/react";

type Props = {
  value: any;
  className?: string;
  dropdownClassName?: string;
  onChange: (value: any) => void;
  options: any[];
  optionRenderer: (option: any, selected: boolean) => JSX.Element;
  onSearch?: (key: string) => void;
  children: JSX.Element;
};

const DropdownSelect = ({
  value,
  className = '',
  dropdownClassName = '',
  onChange,
  options,
  optionRenderer,
  onSearch,
  children
}: Props) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className={`${className} flex items-center justify-between relative w-full cursor-pointer rounded-lg bg-white/5 gap-2 p-2 break-words overflow-hidden text-left text-lg focus:outline-none`}
        >
          {children}
          <span className="pointer-events-none inset-y-0 flex items-center">
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className={`${dropdownClassName} absolute right-0 mt-1 z-20 flex flex-col items-center max-h-60 overflow-auto rounded-md bg-[#202020] backdrop-blur-xl py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm`}>
            {onSearch && 
            <input
              type="text"
              onChange={(e) => onSearch(e.target.value)}
              className="my-1 w-5/6 px-1 py-1 text-xs md:text-base rounded-md bg-gray-700"
              placeholder="Search"
            />
            }
            {options.map((option, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  `relative cursor-pointer text-[#CACACA] select-none w-full p-2 ${
                    active ? "bg-[#2B2B2B]" : ""
                  }`
                }
                value={option}
              >
                {(props) => optionRenderer(option, props.selected)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default DropdownSelect;
