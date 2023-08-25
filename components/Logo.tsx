import Image from "next/image";
import React from "react";
import logo from "@/assets/images/zetagateLogo.svg";

const Logo = () => {
  return (
    <div className="flex flex-col items-start select-none">
      <Image
        src={logo}
        alt="aggregator-logo"
        className="w-11 h-8"
        width={42}
        height={33}
      />
    </div>
  );
};

export default Logo;
