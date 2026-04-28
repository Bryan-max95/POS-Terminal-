import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#141414] disabled:pointer-events-none disabled:opacity-50 border border-transparent select-none rounded-md",
  {
    variants: {
      variant: {
        default: "bg-[#141414] text-white hover:bg-[#2e2e2e]",
        destructive: "bg-[#FF6B6B] text-white hover:bg-[#e05e5e] border-[#141414]",
        outline: "border-[#141414] bg-white hover:bg-[#D4D3D0] text-[#141414]",
        secondary: "bg-[#D4D3D0] text-[#141414] border-[#141414] hover:bg-[#c4c3c0]",
        ghost: "hover:bg-[#D4D3D0] text-[#141414]",
        link: "text-[#141414] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-[10px]",
        lg: "h-12 px-8 text-sm",
        icon: "h-10 w-10",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
