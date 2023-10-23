import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import RefreshIcon from "@/assets/images/refresh.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useGlobalContext } from "@/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

export default function RefreshButton() {
  const { refresh, setRefresh } = useGlobalContext();
  const [customSlippage, setCustomSlippage] = useState<null | number>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to handle the refresh click
  const handleRefreshClick = () => {
    // Start the spinning animation
    setRefresh(!refresh);
    setIsRefreshing(true);

    // Simulate a refresh operation (you can replace this with your actual logic)
    setTimeout(() => {
      // Stop the spinning animation after the refresh is done
      setIsRefreshing(false);
    }, 2000); // Replace 2000 with the actual duration of your refresh operation
  };



  return (
    <div className="max-w-sm px-1 z-[49px]">
<Popover className="relative z-[49px]">
  {({ open }) => (
    <Popover.Button
      onClick={handleRefreshClick} // Add an onClick handler
      className={`${
        open ? "" : ""
      } transition-all p-3 w-12 h-12 rounded-lg focus:outline-none flex justify-center items-center hover:bg-[rgb(255,240,221)]/10 cursor-pointer ${
        isRefreshing ? 'animate-spin cursor-pointer' : ""// Add the spinning animation class
      }`}
    >
      <>
      <RefreshIcon className='cursor-pointer' />
      </>
    </Popover.Button>
  )}
</Popover>
    </div>
  );
}
