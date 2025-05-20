import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

const ThreeGradientButton = ({
  children,
  loading,
  disabled,
  className,
  ...props
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: any;
  className?: string;
}) => {
  return (
    <button
      className={cn("px-2 py-1 rounded-full hover:bg-gradient-to-tl hover:from-primary hover:via-secondary hover:to-primary hover:text-white text-secondary bg-slate-200 font-light text-nowrap tracking-tight text-sm", className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {children}
    </button>
  );
};

export default ThreeGradientButton;
