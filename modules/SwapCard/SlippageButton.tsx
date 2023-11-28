"use client";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import SlippageIcon from "@/assets/images/slippageIcon.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useGlobalContext } from "@/contexts";
import { AnimatePresence, motion } from "framer-motion";

const percentageButtons = [0.5, 1.0, 3.0];

export default function SlippageButton() {
  const { slippage, setSlippage } = useGlobalContext();
  const [customSlippage, setCustomSlippage] = useState<null | number>();
  useEffect(() => {
    if (percentageButtons.some((perc) => perc === slippage)) return;
    setCustomSlippage(slippage);
  }, [slippage]);

  return (
    <div className="flex justify-center items-center sm:w-12 sm:h-12 xs:w-9 xs:h-9 w-8 h-8">
      <Popover className="flex justify-center items-center relative w-full h-full">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${
                  open ? " bg-[rgb(255,240,221)]/10" : ""
                } transition-all w-full h-full rounded-lg focus:outline-none hover:bg-[rgb(255,240,221)]/10 flex justify-center items-center`}
            >
              <AnimatePresence>
                <motion.div whileHover={{ scale: 1.25, transition: { duration: 0.15 }}}>
                  <SlippageIcon className="sm:p-3 p-2 w-full h-full" />
                </motion.div>
              </AnimatePresence>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="opacity-0 translate-y-1/3"
              enterTo="opacity-100 translate-y-1/2"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-1/2"
              leaveTo="opacity-0 translate-y-1/3"
            >
              <Popover.Panel className="absolute z-[2] -left-[120%] lg:left-1/2 xl:w-[26.25rem] sm:w-[24.25rem] w-[16.75rem] xs:mt-20 mt-16 translate-y-1/2 -translate-x-[calc(50%+2rem)] bg-transparent transform sm:px-4 px-2">
                <div className="overflow-hidden  shadow-lg shadow-black/25 ring-1  bg-[rgb(26,29,36)] backdrop-blur-[52px] rounded-3xl ring-black ring-opacity-5">
                  <div className="relative p-4 sm:p-6 flex max-h-[150px] xs:gap-4 gap-2 flex-col">
                    <span className="sm:text-lg xs:text-base text-sm text-[#FFE7DD]">Slippage Tolerance</span>
                    <div className="flex flex-row justify-between items-center gap-3">
                      {percentageButtons.map((val, index) => (
                        <Button
                          className={`cursor-pointer select-none text-white p-2 xl:h-[2rem] sm:h-[1.75rem] h-[1.5rem] xl:min-w-[4.5rem] sm:min-w-[3.75rem] min-w-[2.5rem] rounded-full flex flex-col text-center xs:text-sm text-xs transition-all duration-150 hover:cursor-pointer ${
                            slippage === val
                              ? "scale-[1.15] bg-[#EBC28E] bg-opacity-100 text-black hover:text-black hover:bg-[#EBC28E] hover:bg-opacity-100"
                              : "bg-black bg-opacity-[0.15] hover:text-white hover:bg-white hover:bg-opacity-10"
                          }`}
                          key={"perc-button-" + index}
                          onClick={() => {
                            if(slippage == val) {
                              setCustomSlippage(null);
                              setSlippage(0.5);
                              return;
                            }

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
                        onKeyDown={(e) => {}}
                        className="text-white text-center sm:!text-lg xs:!text-base !text-sm placeholder:sm:!text-lg placeholder:xs:!text-base placeholder:!text-sm h-[2rem] w-full crosschainswap-input"
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
