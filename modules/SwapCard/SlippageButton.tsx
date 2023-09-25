import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import IconSlider from "@/assets/images/icon-sliders.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";

type Props = {
  onChangeSlippage: (slippage: number) => void;
  slippage: number;
};
const percentageButtons = [0.5, 1.0, 3.0];

export default function SlippageButton(props: Props) {
  const [selectedSlippage, setSelectedSlippage] = useState(props.slippage);
  const [customSlippage, setCustomSlippage] = useState<null | number>();

  return (
    <div className=" w-full max-w-sm px-4">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "bg-[#FAC790] text-black" : "bg-[#FAC790]/[.04] text-white/50"}
                 transition-all p-3 w-12 h-12 rounded-lg hover:bg-[#FAC790] focus:outline-none hover:text-black flex justify-center items-center`}
            >
              <IconSlider />
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
                <div className="overflow-hidden rounded-lg shadow-lg ring-1  backdrop-blur-2xl bg-white/10 ring-black ring-opacity-5">
                  <div className="relative p-7 flex gap-4 flex-col">
                    <span className="text-sm">Slippage Tolerance</span>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      {percentageButtons.map((val, index) => (
                        <Button
                          className={`font-inter text-sm ${
                            selectedSlippage === val ? "bg-[#FAC790] text-black" : ""
                          }`}
                          key={"perc-button-" + index}
                          onClick={() => {
                            setSelectedSlippage(val);
                            setCustomSlippage(null);
                            props.onChangeSlippage(val);
                          }}
                        >
                          {val}%
                        </Button>
                      ))}
                      <Input
                        onChange={(e) => {
                          setCustomSlippage(e.target.valueAsNumber);
                          setSelectedSlippage(e.target.valueAsNumber);
                          props.onChangeSlippage(e.target.valueAsNumber);
                        }}
                        value={customSlippage}
                        type="number"
                        placeholder="Custom"
                        className="w-full crosschainswap-input"
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
