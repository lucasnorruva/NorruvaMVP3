
import * as React from "react"
import { Slot } from "@radix-ui/react-slot" // Import Slot
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean; // Add asChild to prop types
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) { // Destructure asChild
  const Comp = asChild ? Slot : "span"; // Use Slot if asChild is true
  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      {...props} // asChild is no longer in ...props if handled by Slot
    />
  )
}

export { Badge }
