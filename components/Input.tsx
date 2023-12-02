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
      className={`w-full focus:outline-0 text-[#FFF0DD]/90 xs:text-2xl text-base xs:py-2 py-1 bg-transparent border-b-2 transition-all duration-150  border-white focus:border-[#EBC28E] placeholder:lg:text-xl placeholder:xs:text-base placeholder:text-sm tracking-wide ${className} ` + (
        disabled ? "border-opacity-0 focus:border-opacity-0 " : "border-opacity-10 focus:border-opacity-100 "
      )}
    />
  ) : (
    <div
      className={`${className} rounded-lg w-full flex justify-center items-center focus:outline-0 bg-black bg-opacity-[0.15] lg:py-3 py-2 tracking-wide animate-pulse`}
    >
      <Image
        src={"/logo.png"}
        alt="logo-loading"
        width={48}
        height={48}
        className="animate-spin-slow md:w-[48px] sm:w-[40px] xs:w-[32px] w-[24px] md:h-[48px] sm:h-[40px] xs:h-[32px] h-[24px]"
      />
    </div>
  );
};

export default Input;
