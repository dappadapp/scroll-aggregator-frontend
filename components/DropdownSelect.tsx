import { Fragment, useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
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
  className = "",
  dropdownClassName = "",
  onChange,
  options,
  optionRenderer,
  onSearch,
  children
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Add event listener to detect clicks outside of the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative inline-block" ref={dropdownRef}>
        <div
          className={`${className} relative cursor-pointer bg-white/5 rounded-lg focus:outline-none z-[10]`}
          onClick={toggleDropdown}
        >
          <div className="flex items-center justify-between p-2">
            <div className="text-lg">{children}</div>
            <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
          </div>
        </div>
        <Transition
          show={isOpen}
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 scale-0"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-150 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-0"
        >
          <div className={` ${className} ${dropdownClassName} absolute right-0 top-full mt-2 w-64 max-h-60 overflow-y-auto rounded-md bg-gray-900 bg-opacity-90 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm`}>
            {onSearch && (
              <div className="p-2">
                <div className="relative">
                  <input
                    type="text"
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full px-3 py-2 text-gray-100 rounded-md bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Search"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>
            )}
            <ul className="list-none">
              {options.map((option, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `cursor-pointer select-none w-full p-2 z-100 ${value === option ? "bg-[#2B2B2B] text-blue-500" : ""
                    } ${active ? "bg-gray-700" : ""}`
                  }
                  value={option}
                >
                  {(props) => optionRenderer(option, props.selected)}
                </Listbox.Option>
              ))}
            </ul>
          </div>
        </Transition>
      </div>
    </Listbox>
  );
};

export default DropdownSelect;
