import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display text-sm font-bold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 neon-glow rounded-full px-8 py-3",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-muted rounded-full px-8 py-3",
        outline:
          "border border-primary text-primary bg-transparent hover:bg-primary/10 rounded-full px-8 py-3",
        ghost: "hover:bg-muted rounded-md px-4 py-2 normal-case font-sans font-medium",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 rounded-full px-8 py-3",
        link: "text-primary underline-offset-4 hover:underline normal-case font-sans",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
