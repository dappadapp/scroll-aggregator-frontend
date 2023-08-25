import { Fragment, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Listbox, Transition } from "@headlessui/react";

type Props = {
  value: any;
  flexReverse?: boolean;
  onChange: (value: any) => void;
  options: any[];
  optionRenderer?: (option: any, selected: boolean) => JSX.Element;
};

const DropdownSelect = ({
  value,
  onChange,
  flexReverse = false,
  options,
  optionRenderer = defaultOptionRenderer,
}: Props) => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative md:max-w-[120px] w-full">
        <Listbox.Button
          className={`${
            !flexReverse ? "flex-row" : "flex-row-reverse"
          } flex items-center justify-between relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 p-2 break-words overflow-hidden text-left text-lg focus:outline-none`}
        >
          <div className="flex items-center gap-2">
            <Image
              src={`/chains/${value.image}`}
              alt={value.name}
              width={25}
              height={25}
              className="rounded-full w-4 h-4 md:w-6 md:h-6"
            />
            <span className="block md:max-w-[80px] truncate text-xs md:text-base font-medium">
              {value.name}
            </span>
          </div>
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
          <Listbox.Options className="absolute mt-1 z-20  flex flex-col items-center max-h-60 w-full overflow-auto rounded-md bg-[#202020] backdrop-blur-xl py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="my-1 w-5/6 px-1 py-1 text-xs md:text-base rounded-md bg-gray-700"
              placeholder="Search"
            />
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

const defaultOptionRenderer = (option: any, selected: any) => (
  <div
    className={`flex items-center gap-2 p-1 ${selected ? "bg-[#2B2B2B] rounded-lg" : ""}`}
  >
    <Image
      src={`/chains/${option.image}`}
      alt={option.name}
      width={25}
      height={25}
      className="rounded-full w-4 h-4 md:w-6 md:h-6"
    />
    <span className="block truncate text-xs md:text-base font-medium">{option.name}</span>
  </div>
);
export default DropdownSelect;
