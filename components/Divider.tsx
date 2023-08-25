import React from "react";
type Props = {
  className: string;
};

export const Divider: React.FC<Props> = ({ className }) => {
  return <div className={`bg-white/10 fixed ${className}`}></div>;
};
