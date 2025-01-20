import { z } from "zod"

export const jobSeekerProfileSchema = z.object({
	headline: z.string({ required_error: "Headline is required" }),
	summary: z.string({ required_error: "Summary is required" }),
	shareEmail: z.boolean(),
	phoneNumber: z.string().optional(),
})
