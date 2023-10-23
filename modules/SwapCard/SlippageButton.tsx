import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import SlippageIcon from "@/assets/images/slippageIcon.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useGlobalContext } from "@/contexts";

const percentageButtons = [0.5, 1.0, 3.0];

export default function SlippageButton() {
  const { slippage, setSlippage } = useGlobalContext();
  const [customSlippage, setCustomSlippage] = useState<null | number>();
  useEffect(() => {
    if (percentageButtons.some((perc) => perc === slippage)) return;
    setCustomSlippage(slippage);
  }, [slippage]);

  return (
    <div className="max-w-sm px-1 z-[49px]">
      <Popover className="relative z-[49px]">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? " bg-[rgb(255,240,221)]/10" : ""} transition-all p-3 w-12 h-12 rounded-lg focus:outline-none hover:bg-[rgb(255,240,221)]/10 flex justify-center items-center`}
            >
              <SlippageIcon />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-1/4 lg:left-1/2 z-50 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden  shadow-lg ring-1  bg-[rgba(26,29,36,1)] backdrop-blur-[52px] rounded-[8px] ring-black ring-opacity-5">
                  <div className="relative p-7 flex max-h-[150px] gap-4 flex-col">
                    <span className="text-sm">Slippage Tolerance</span>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      {percentageButtons.map((val, index) => (
                        <Button
                          className={`font-monteserrat max-h-[50px] text-sm ${
                            slippage === val
                              ? "bg-[#FFE7DD] text-black"
                              : "bg-transparent text-white"
                          }`}
                          key={"perc-button-" + index}
                          onClick={() => {
                            setCustomSlippage(null);
                            setSlippage(val);
                          }}
                        >
                          {val}%
                        </Button>
                      ))}
                      <Input
                        onChange={(e) => {
                          setCustomSlippage(e.target.valueAsNumber);
                          setSlippage(e.target.valueAsNumber);
                        }}
                        value={customSlippage}
                        type="number"
                        placeholder="Custom"
                        className="w-full m-h-[50px] text-[#FFE7DD] text-center lg:!text-[20px] crosschainswap-input"
                      />
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
