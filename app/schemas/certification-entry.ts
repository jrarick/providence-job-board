import { z } from "zod"

export const certificationEntrySchema = z.object({
	title: z.string(),
	issuingOrg: z.string(),
	issueDate: z.number().min(1940).max(new Date().getFullYear()).optional(),
	expirationDate: z.number().min(1940).max(new Date().getFullYear()).optional(),
	url: z.string().url().optional(),
})

export type CertificationEntry = z.infer<typeof certificationEntrySchema> & {
	id: number
	jobSeekerProfileId: number
	profileId: string
}
