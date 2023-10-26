"use client";
import React from "react";
import AddressLogo from "@/assets/images/address-logo.png";
import Image from "next/image";

type Props = {
  addresses: number;
};

function AddressesCart(props: Props) {
  return (
    <div className="w-full justify-center items-center p-6 flex flex-col h-[267px] flex-1 gap-6 bg-[rgba(26,29,36,0.80)] backdrop-blur-[52px] rounded-[40px]">
      <div className="flex justify-center items-center w-20 h-20 rounded-[24px] bg-[#EBC28E] bg-opacity-5">
        <Image
          src={AddressLogo}
          alt="addresses-logo"
          className="w-6 h-6"
          width={24}
          height={24}
        />
      </div>
      <div className="flex p-6 justify-end flex-col items-center gap-4">
        <span className="text-[#FFF0DD] text-lg lg:text-[40px] font-light">
          {props.addresses}
        </span>
        <span className="text-[#EBC28E] flex gap-2 text-sm lg:text-[20px]">
          Addresses
        </span>
      </div>
    </div>
  );
}

export default AddressesCart;
