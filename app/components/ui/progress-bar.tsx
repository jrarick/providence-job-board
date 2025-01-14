// https://github.com/epicweb-dev/epic-stack/blob/main/app/components/progress-bar.tsx
import { RefreshCwIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigation } from "react-router"
import { useSpinDelay } from "spin-delay"
import { cn } from "~/lib/utils"

function ProgressBar() {
	const transition = useNavigation()
	const busy = transition.state !== "idle"
	const delayedPending = useSpinDelay(busy, {
		delay: 600,
		minDuration: 400,
	})
	const ref = useRef<HTMLDivElement>(null)
	const [animationComplete, setAnimationComplete] = useState(true)

	useEffect(() => {
		if (!ref.current) return
		if (delayedPending) setAnimationComplete(false)

		const animationPromises = ref.current
			.getAnimations()
			.map(({ finished }) => finished)

		void Promise.allSettled(animationPromises).then(() => {
			if (!delayedPending) setAnimationComplete(true)
		})
	}, [delayedPending])

	return (
		// biome-ignore lint/a11y/useFocusableInteractive: false
		<div
			// biome-ignore lint/a11y/useAriaPropsForRole: false
			role="progressbar"
			aria-hidden={delayedPending ? undefined : true}
			aria-valuetext={delayedPending ? "Loading" : undefined}
			className="fixed inset-x-0 top-0 left-0 z-50 h-[0.20rem] animate-pulse"
		>
			<div
				ref={ref}
				className={cn(
					"h-full w-0 bg-foreground duration-500 ease-in-out",
					transition.state === "idle" &&
						(animationComplete
							? "transition-none"
							: "w-full opacity-0 transition-all"),
					delayedPending && transition.state === "submitting" && "w-5/12",
					delayedPending && transition.state === "loading" && "w-8/12",
				)}
			/>
			{delayedPending && (
				<div className="absolute flex items-center justify-center">
					<RefreshCwIcon
						className="m-1 size-5 animate-spin text-foreground"
						aria-hidden
					/>
				</div>
			)}
		</div>
	)
}

export { ProgressBar }
