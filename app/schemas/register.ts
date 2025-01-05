import { z } from "zod"

export const registerSchema = z.object({
	firstName: z
		.string()
		.min(1, "First name is required.")
		.max(50, "First name must be 50 characters or less."),
	lastName: z
		.string()
		.min(1, "Last name is required.")
		.max(50, "Last name must be 50 characters or less."),
	email: z.string().email("Invalid email address."),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long.")
		.max(100, "Password must be 100 characters or less."),
})

export type Register = z.infer<typeof registerSchema>
