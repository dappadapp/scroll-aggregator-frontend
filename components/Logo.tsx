import React from "react";
import LogoSvg from "@/assets/images/logo-aggre.svg";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="select-none">
      <LogoSvg alt="Aggregator" width={200} height={100} />
    </div>
  );
};

export default Logo;
