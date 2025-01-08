import { createId as cuid } from "@paralleldrive/cuid2"
import { z } from "zod"

export const toastSchema = z.object({
	description: z.string(),
	id: z.string().default(() => cuid()),
	title: z.string(),
	type: z.enum(["message", "success", "error"]).default("message"),
})

export type Toast = z.infer<typeof toastSchema>
export type ToastInput = z.input<typeof toastSchema>
