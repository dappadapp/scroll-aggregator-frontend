import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import RefreshIcon from "@/assets/images/refresh.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useGlobalContext } from "@/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";

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
      <div className="flex justify-center items-center sm:w-12 sm:h-12 xs:w-9 xs:h-9 w-8 h-8">
        <Popover className="flex justify-center items-center relative w-full h-full">
          {({ open }) => (
            <Popover.Button
              onClick={handleRefreshClick} // Add an onClick handler
              className={`${
                open ? "" : ""
              } transition-all w-full h-full rounded-lg focus:outline-none flex justify-center items-center hover:bg-[rgb(255,240,221)]/10 cursor-pointer ${
                isRefreshing ? "cursor-pointer" : "" // Add the spinning animation class
              }`}
            > 
              <AnimatePresence>
                <motion.div whileHover={{ rotate: 135, scale: 1.125, transition: { duration: 0.15 }}}>
                  <RefreshIcon
                    className={`${isRefreshing && "animate-spin"} sm:p-3 p-2 cursor-pointer w-full h-full`}
                  />
                </motion.div>
              </AnimatePresence>
            </Popover.Button>
          )}
      </Popover>
    </div>
  );
}