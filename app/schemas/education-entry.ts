import { z } from "zod"

export const educationEntrySchema = z.object({
	institution: z.string(),
	degree: z.string().optional(),
	fieldOfStudy: z.string(),
	gpa: z
		.number()
		.min(0, "Must be higher than 0.0")
		.max(4, "Cannot be higher than 4.0")
		.optional(),
	graduationDate: z.number().min(1940).max(new Date().getFullYear()).optional(),
	description: z.string().optional(),
})

export type EducationEntry = z.infer<typeof educationEntrySchema> & {
	id: number
	jobSeekerProfileId: number
	profileId: string
}
