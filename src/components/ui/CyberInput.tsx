import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const CyberInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-md border-2 border-border bg-card px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary transition-all duration-300 group-hover:border-primary/50 group-hover:cyber-shadow",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-focus-within:w-full" />
        <div className="absolute top-0 right-0 w-[2px] h-0 bg-primary transition-all duration-500 group-focus-within:h-full" />
      </div>
    )
  }
)
CyberInput.displayName = "CyberInput"

export { CyberInput }
