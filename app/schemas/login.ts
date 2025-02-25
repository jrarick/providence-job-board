import { z } from "zod"

export const loginSchema = z.object({
	email: z.string().email("Invalid email address."),
	password: z.string(),
})

export type Login = z.infer<typeof loginSchema>
