import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none text-xs font-black uppercase italic tracking-[0.2em] ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-black hover:bg-white transition-all shadow-none border border-primary hover:border-white",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 transition-all",
        outline:
          "border border-white/10 bg-transparent text-white/50 hover:text-white hover:border-white transition-all",
        secondary:
          "bg-white/5 text-white hover:bg-white/10 border border-white/5 hover:border-white/10",
        ghost: "text-white/40 hover:text-white hover:bg-white/5 transition-all",
        link: "text-primary border-b border-primary/0 hover:border-primary transition-all pb-0.5",
        neon: "bg-transparent border border-primary text-primary shadow-[0_0_15px_rgba(204,255,0,0.1)] hover:bg-primary/5 hover:shadow-[0_0_30px_rgba(204,255,0,0.2)]", 
        cyberpunk: "uiverse-glow-btn",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4",
        lg: "h-14 px-10 text-sm tracking-[0.3em]",
        xl: "h-16 px-12 text-base tracking-[0.4em]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading...
          </span>
        ) : children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
