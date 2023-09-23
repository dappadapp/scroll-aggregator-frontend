import React from "react";

type Props = {
  value: any;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  disabled?: boolean;
  onChange?: (event: any) => void;
  onKeyDown?: (event: any) => void;
};

const Input: React.FC<Props> = ({
  value,
  className = '',
  placeholder,
  type,
  disabled,
  onChange,
  onKeyDown
}) => {
  return (
    <input
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      className={`${className} rounded-lg p-2 w-full focus:outline-0 text-base border-none bg-transparent tracking-wide`}
    />
  );
};

export default Input;