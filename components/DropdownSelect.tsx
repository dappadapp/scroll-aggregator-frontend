import { useEffect, useRef, useState } from "react";
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
  children,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="static inline-block lg:max-w-none" ref={dropdownRef}>
        <div
          className={`${className} static cursor-pointer bg-gray-800/60 rounded-lg focus:outline-none`}
          onClick={toggleDropdown}
        >
          <div className="flex items-center justify-between p-2">
            <div className="text-sm lg:text-lg">{children}</div>
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
          <div
            className={` ${className} ${dropdownClassName} absolute right-0 top-full mt-2 w-64 max-h-60 overflow-y-auto rounded-md bg-[#12141A]/80 backdrop-blur-md text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm`}
          >
            {onSearch && (
              <div className="p-2">
                <div className="relative">
                  <input
                    type="text"
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full px-3 py-2 text-gray-100 rounded-md bg-gray-800/60 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Search"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>
            )}
            <ul className="list-none sticky">
              {options.map((option, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `cursor-pointer select-none w-full p-2 ${
                      value === option ? "bg-gray-800/60 p-2" : ""
                    }`
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
