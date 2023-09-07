import Image from "next/image";
import React from "react";
import LogoSvg from "@/assets/images/zetagateLogo.svg";

const Logo = () => {
  return (
    <div className="flex flex-col items-start select-none">
      <LogoSvg />
    </div>
  );
};

export default Logo;
