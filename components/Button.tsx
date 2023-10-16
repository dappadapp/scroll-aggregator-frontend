import React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
import LoadingIcon from "@/assets/images/loading.svg";

export const buttonVariants = cva(
  "p-2 rounded flex transition-all justify-center items-center",
  {
    variants: {
      variant: {
        primary:
          "hover:bg-[#FFE7DD]/[.04] hover:text-white/50 bg-[#FFE7DD] text-black flex justify-center items-center",
        secondary: "bg-[#3AFF4242] text-white",
        disabled: "bg-[#202020] text-[#AAA] cursor-not-allowed",
        bordered:
          "bg-[#FFE7DD]/[.04] text-white/75 hover:bg-[#FFE7DD] hover:text-black border border-white/10",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface Props extends VariantProps<typeof buttonVariants> {
  disabled?: boolean;
  className?: string;
  onClick?: (event: any) => void;
  loading?: boolean;
  children: any;
}

const Button: React.FC<Props> = ({
  variant,
  className,
  onClick,
  disabled = false,
  loading = false,
  children,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={(e) => onClick && onClick(e)}
      className={cn(buttonVariants({ variant, className }))}
    >
      {children}
      {loading && <LoadingIcon className="w-5 h-5 animate-spin ms-2" />}
    </button>
  );
};

export default Button;
