import React from "react";

type Props = {
  value: any;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  disabled?: boolean;
  onChange: (event: any) => void;
};

const Input: React.FC<Props> = (props) => {
  return (
    <input
      onChange={(e) => props.onChange(e)}
      value={props.value}
      placeholder={props.placeholder}
      type={props.type}
      disabled={props.disabled}
      className={`${props.className} rounded-lg p-2 w-full focus:outline-0 text-base border-none bg-transparent`}
    />
  );
};

export default Input;