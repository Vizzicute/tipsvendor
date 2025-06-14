import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { Button, ButtonProps } from "./ui/button";

interface GradientButtonProps extends ButtonProps {
  loading?: boolean;
  disabled?: any;
  className?: string;
}

const GradientButton = ({
  loading,
  disabled,
  className,
  ...props
}: GradientButtonProps) => {
  return (
    <Button
      className={cn("p-2 rounded-full bg-gradient-to-r from-primary to-secondary border-secondary border-1 shadow-sm font-semibold tracking-wider text-sm", className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {props.children}
    </Button>
  );
};

export default GradientButton;
