import React from "react";
import LogoSvg from "@/assets/images/aggre-logo.png";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="select-none">
      <Image src={LogoSvg} alt="Aggregator" width={250} height={180} />
    </div>
  );
};

export default Logo;
