import React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

export const buttonVariants = cva(
  "p-2 rounded flex transition-all justify-center items-center",
  {
    variants: {
      variant: {
        primary:
          "bg-white/[.04] text-white/50 hover:bg-white/20 hover:text-black flex justify-center items-center",
        secondary: "bg-[#3AFF4242] text-white",
        disabled: "bg-[#202020] text-[#AAA]",
        bordered: "bg-white/[.04] text-white/75 border border-white/10"
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
  children: any;
}

export const Button: React.FC<Props> = ({
  disabled = false,
  className,
  onClick,
  children,
  variant,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={(e) => onClick!(e)}
      className={cn(buttonVariants({ variant, className }))}
    >
      {children}
    </button>
  );
};
