import { cn } from "~/lib/utils"

export default function Container({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<div
			className={cn("mx-auto max-w-7xl px-2 py-24 sm:px-6 lg:px-8", className)}
		>
			{children}
		</div>
	)
}
