import * as React from "react"
import CurrencyInput from "react-currency-input-field"

import { cn } from "~/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground shadow-black/5 shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					type === "search" &&
						"[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
					type === "file" &&
						"p-0 pr-3 text-muted-foreground/70 italic file:me-3 file:h-full file:border-0 file:border-input file:border-r file:border-solid file:bg-transparent file:px-3 file:font-medium file:text-foreground file:text-sm file:not-italic",
					className,
				)}
				ref={ref}
				{...props}
			/>
		)
	},
)
Input.displayName = "Input"

const MoneyInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<typeof CurrencyInput>
>(({ className, ...props }, ref) => {
	return (
		<CurrencyInput
			className={cn(
				"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground shadow-black/5 shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className,
			)}
			ref={ref}
			{...props}
		/>
	)
})
MoneyInput.displayName = "MoneyInput"

export { Input, MoneyInput as CurrencyInput }
