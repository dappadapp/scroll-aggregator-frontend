import React from "react";
import LogoSvg from "@/assets/images/logo-aggre.svg";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="h-full w-full select-none">
      <LogoSvg alt="Aggregator" width={200} height={100} className="w-full h-full" />
    </div>
  );
};

export default Logo;
