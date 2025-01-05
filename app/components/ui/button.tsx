import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded font-display font-medium font-semibold font-semibold text-lg uppercase tracking-widest outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-black/5 shadow-sm hover:bg-primary/90 active:bg-primary/80",
				destructive:
					"bg-destructive text-destructive-foreground shadow-black/5 shadow-sm hover:bg-destructive/90 active:bg-destructive/80",
				outline:
					"border border-input bg-background shadow-black/5 shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
				secondary:
					"bg-secondary text-secondary-foreground shadow-black/5 shadow-sm hover:bg-secondary/85 active:bg-secondary/70",
				ghost:
					"hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
				link: "text-primary underline-offset-4 hover:underline active:text-muted-foreground",
			},
			size: {
				default: "h-14 px-8 py-5",
				sm: "h-9 rounded px-3",
				lg: "h-11 rounded px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
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
	},
)
Button.displayName = "Button"

export { Button, buttonVariants }
