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
      className={`rounded-lg p-2 w-full focus:outline-0 text-[#FFF0DD]/90 text-md lg:text-[64px] bg-transparent  placeholder:text-base placeholder:lg:text-xl tracking-wide ${className} `}
    />
  ) : (
    <div
      className={`${className} rounded-lg ml-2 w-full flex justify-center items-center focus:outline-0 bg-slate-200 mb-2 bg-opacity-25 h-[60px] lg:h-[80px] text-[64px] lg:mt-2 tracking-wide animate-pulse`}
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
