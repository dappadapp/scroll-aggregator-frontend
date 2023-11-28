import Image from "next/image";
import React from "react";

type Props = {
  value: any;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (event: any) => void;
  onKeyDown?: (event: any) => void;
};

const Input: React.FC<Props> = ({
  value,
  className = "",
  placeholder,
  type,
  disabled,
  onChange,
  onKeyDown,
  loading,
}) => {
  const preventNegativeValues = (e: any) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  return !loading ? (
    <input
      onChange={onChange}
      onKeyDown={(e) => {
        preventNegativeValues(e);
        onKeyDown!(e);
      }}
      min={type === "number" ? 0 : undefined}
      value={value}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      className={`w-full focus:outline-0 text-[#FFF0DD]/90 text-sm xs:text-base lg:text-xl xs:py-2 py-1 bg-transparent border-b-2 transition-all duration-150  border-white focus:border-[#EBC28E] placeholder:text-sm placeholder:xs:text-base placeholder:lg:text-xl tracking-wide ${className} ` + (
        disabled ? "border-opacity-0 focus:border-opacity-0 " : "border-opacity-10 focus:border-opacity-100 "
      )}
    />
  ) : (
    <div
      className={`${className} rounded-lg w-full flex justify-center items-center focus:outline-0 bg-white bg-opacity-10 lg:text-4xl py-3 text-[64px] tracking-wide animate-pulse`}
    >
      <Image
        src={"/logo.png"}
        alt="logo-loading"
        className="animate-spin-slow"
        width={48}
        height={48}
      />
    </div>
  );
};

export default Input;
