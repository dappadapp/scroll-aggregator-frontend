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
  return !loading ? (
    <input
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      className={`${className} rounded-lg p-2 w-full focus:outline-0 border-b border-white/[.20] h-[50.8px] bg-transparent tracking-wide`}
    />
  ) : (
    <div
      className={`${className} rounded-lg p-2 w-full focus:outline-0  border-b border-white/[.20] bg-slate-200 bg-opacity-25 h-[50.8px] mt-2 tracking-wide animate-pulse`}
    ></div>
  );
};

export default Input;
