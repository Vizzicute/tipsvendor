import React, { useState} from 'react'
import { Input, InputProps } from './ui/input'
import { cn } from "@/lib/utils"
import { EyeOff, Eye } from "lucide-react"

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props}, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    
    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pe-10", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? "Hide Password" : "Show Password"}
          className="absolute right-3 top-2/4 -translate-1/2 transform text-slate-400"
        >
          {showPassword ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export {PasswordInput}