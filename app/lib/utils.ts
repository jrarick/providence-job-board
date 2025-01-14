import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function combineHeaders(
	...headers: Array<ResponseInit["headers"] | null | undefined>
) {
	const combined = new Headers()
	for (const header of headers) {
		if (!header) continue
		for (const [key, value] of new Headers(header).entries()) {
			combined.append(key, value)
		}
	}
	return combined
}

export function timeSincePosted(date: Date) {
	const now = new Date()
	const then = new Date(date)
	then.setHours(0, 0, 0, 0)
	const diff = now.getTime() - then.getTime()
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))
	const isLeapYear = (now: Date) => {
		const year = now.getFullYear()
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
	}
	const averageDaysInMonth = isLeapYear(now) ? 30.5 : 30.417

	if (days > 90) {
		return `${Math.round(days / 30.44)} months ago`
	}
	if (days === 0) {
		return "Today"
	}
	if (days === 1) {
		return "Yesterday"
	}
	if (days === 7) {
		return "1 week ago"
	}
	if (
		(Math.floor(days % averageDaysInMonth) < 3 ||
			Math.floor(days % averageDaysInMonth) > 28) &&
		days < 34 &&
		days > 28
	) {
		return "1 month ago"
	}
	if (
		days > 56 &&
		(Math.floor(days % averageDaysInMonth) < 3 ||
			Math.floor(days % averageDaysInMonth) > 28)
	) {
		return `${Math.round(days / 30.44)} months ago`
	}
	if (days % 7 === 0 && days <= 90) {
		return `${days / 7} weeks ago`
	}
	if (days > 33) {
		return `${Math.round(days / 7)} weeks ago`
	}
	return `${days} days ago`
}
