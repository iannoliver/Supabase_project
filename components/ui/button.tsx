import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "danger" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
};

const buttonVariants = {
  default: "bg-slate-950 text-white shadow-sm hover:bg-slate-800 hover:text-white focus-visible:text-white",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-500 hover:text-white focus-visible:text-white",
  outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
};

const buttonSizes = {
  default: "h-11 px-5 text-sm",
  sm: "h-9 rounded-lg px-4 text-sm",
  lg: "h-12 rounded-xl px-6 text-base",
  icon: "size-10 rounded-xl p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
