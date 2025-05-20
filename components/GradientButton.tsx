import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface GradientButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: any;
  className?: string;
  onClick?: () => void;
}

const GradientButton = ({
  children,
  loading,
  disabled,
  className,
  onClick,
  ...props
}: GradientButtonProps) => {
  return (
    <button
      className={cn("p-2 rounded-full bg-gradient-to-r from-primary to-secondary border-secondary border-1 shadow-sm font-semibold tracking-wider text-sm", className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {children}
    </button>
  );
};

export default GradientButton;
